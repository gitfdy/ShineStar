package com.shinestar;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class GoogleCloudSpeechModule extends ReactContextBaseJavaModule {
    private static final String TAG = "GoogleCloudSpeechModule";
    private static final int PERMISSION_REQUEST_CODE = 456;
    
    // Google Cloud Speech-to-Text配置
    private static final String GOOGLE_CLOUD_SPEECH_API_URL = "https://speech.googleapis.com/v1/speech:recognize";
    private static final String API_KEY = "YOUR_GOOGLE_CLOUD_API_KEY"; // 需要替换为实际的API密钥
    
    // 音频录制配置
    private static final int SAMPLE_RATE = 16000;
    private static final int CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO;
    private static final int AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT;
    private static final int BUFFER_SIZE = AudioRecord.getMinBufferSize(SAMPLE_RATE, CHANNEL_CONFIG, AUDIO_FORMAT);
    
    private final ReactApplicationContext reactContext;
    private final ExecutorService executorService;
    private final Handler mainHandler;
    private final OkHttpClient httpClient;
    
    private AudioRecord audioRecord;
    private AtomicBoolean isListening;
    private String currentLanguage;
    private String currentApiKey;
    
    public GoogleCloudSpeechModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.executorService = Executors.newCachedThreadPool();
        this.mainHandler = new Handler(Looper.getMainLooper());
        this.httpClient = new OkHttpClient();
        this.isListening = new AtomicBoolean(false);
        this.currentLanguage = "en-US";
        this.currentApiKey = API_KEY;
    }
    
    @Override
    public String getName() {
        return "GoogleCloudSpeechModule";
    }
    
    @ReactMethod
    public void setApiKey(String apiKey, Promise promise) {
        try {
            this.currentApiKey = apiKey;
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("API_KEY_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void startListening(String language, Promise promise) {
        if (isListening.get()) {
            promise.reject("ALREADY_LISTENING", "Google Cloud Speech recognition is already active");
            return;
        }
        
        if (!checkPermission()) {
            requestPermission(promise);
            return;
        }
        
        if (!checkNetworkConnection()) {
            promise.reject("NO_NETWORK", "网络连接不可用，Google Cloud Speech需要网络连接");
            return;
        }
        
        if (currentApiKey.equals("YOUR_GOOGLE_CLOUD_API_KEY")) {
            promise.reject("NO_API_KEY", "请先设置Google Cloud API密钥");
            return;
        }
        
        this.currentLanguage = language;
        
        executorService.execute(() -> {
            try {
                startAudioRecording();
                mainHandler.post(() -> {
                    sendEvent("onStart", null);
                    promise.resolve("Started Google Cloud Speech recognition");
                });
            } catch (Exception e) {
                Log.e(TAG, "Error starting Google Cloud Speech recognition", e);
                mainHandler.post(() -> {
                    promise.reject("START_ERROR", e.getMessage());
                });
            }
        });
    }
    
    @ReactMethod
    public void stopListening(Promise promise) {
        if (!isListening.get()) {
            promise.reject("NOT_LISTENING", "Google Cloud Speech recognition is not active");
            return;
        }
        
        executorService.execute(() -> {
            try {
                stopAudioRecording();
                mainHandler.post(() -> {
                    sendEvent("onStop", null);
                    promise.resolve("Stopped Google Cloud Speech recognition");
                });
            } catch (Exception e) {
                Log.e(TAG, "Error stopping Google Cloud Speech recognition", e);
                mainHandler.post(() -> {
                    promise.reject("STOP_ERROR", e.getMessage());
                });
            }
        });
    }
    
    @ReactMethod
    public void setLanguage(String language, Promise promise) {
        try {
            this.currentLanguage = language;
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("LANGUAGE_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void isAvailable(Promise promise) {
        try {
            WritableMap result = Arguments.createMap();
            
            boolean hasPermission = checkPermission();
            boolean hasNetwork = checkNetworkConnection();
            boolean hasApiKey = !currentApiKey.equals("YOUR_GOOGLE_CLOUD_API_KEY");
            
            result.putBoolean("available", hasPermission && hasNetwork && hasApiKey);
            result.putBoolean("hasPermission", hasPermission);
            result.putBoolean("hasNetwork", hasNetwork);
            result.putBoolean("hasApiKey", hasApiKey);
            result.putString("deviceInfo", getDeviceInfo());
            
            if (!hasPermission) {
                result.putString("reason", "缺少麦克风权限");
            } else if (!hasNetwork) {
                result.putString("reason", "网络连接不可用");
            } else if (!hasApiKey) {
                result.putString("reason", "未设置Google Cloud API密钥");
            }
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("CHECK_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getServiceInfo(Promise promise) {
        try {
            WritableMap result = Arguments.createMap();
            result.putBoolean("available", isAvailable());
            result.putString("serviceName", "Google Cloud Speech-to-Text");
            result.putString("apiUrl", GOOGLE_CLOUD_SPEECH_API_URL);
            result.putString("currentLanguage", currentLanguage);
            result.putString("sampleRate", String.valueOf(SAMPLE_RATE));
            result.putString("deviceInfo", getDeviceInfo());
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("SERVICE_INFO_ERROR", e.getMessage());
        }
    }
    
    private void startAudioRecording() throws Exception {
        if (audioRecord != null) {
            audioRecord.release();
        }
        
        audioRecord = new AudioRecord(
            MediaRecorder.AudioSource.MIC,
            SAMPLE_RATE,
            CHANNEL_CONFIG,
            AUDIO_FORMAT,
            BUFFER_SIZE
        );
        
        if (audioRecord.getState() != AudioRecord.STATE_INITIALIZED) {
            throw new Exception("无法初始化音频录制");
        }
        
        isListening.set(true);
        audioRecord.startRecording();
        
        // 开始音频流处理
        processAudioStream();
    }
    
    private void stopAudioRecording() {
        isListening.set(false);
        
        if (audioRecord != null) {
            audioRecord.stop();
            audioRecord.release();
            audioRecord = null;
        }
    }
    
    private void processAudioStream() {
        byte[] buffer = new byte[BUFFER_SIZE];
        
        while (isListening.get() && audioRecord != null) {
            int bytesRead = audioRecord.read(buffer, 0, buffer.length);
            
            if (bytesRead > 0) {
                // 发送音频数据到Google Cloud Speech API
                sendAudioToGoogleCloud(buffer, bytesRead);
            }
        }
    }
    
    private void sendAudioToGoogleCloud(byte[] audioData, int bytesRead) {
        try {
            // 将音频数据编码为base64
            String base64Audio = android.util.Base64.encodeToString(audioData, 0, bytesRead, android.util.Base64.NO_WRAP);
            
            // 构建请求JSON
            JSONObject requestJson = new JSONObject();
            JSONObject config = new JSONObject();
            config.put("encoding", "LINEAR16");
            config.put("sampleRateHertz", SAMPLE_RATE);
            config.put("languageCode", currentLanguage);
            config.put("enableAutomaticPunctuation", true);
            config.put("enableWordTimeOffsets", true);
            config.put("enableWordConfidence", true);
            
            JSONObject audio = new JSONObject();
            audio.put("content", base64Audio);
            
            requestJson.put("config", config);
            requestJson.put("audio", audio);
            
            // 发送HTTP请求
            String url = GOOGLE_CLOUD_SPEECH_API_URL + "?key=" + currentApiKey;
            RequestBody body = RequestBody.create(
                MediaType.parse("application/json"),
                requestJson.toString()
            );
            
            Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();
            
            executorService.execute(() -> {
                try {
                    Response response = httpClient.newCall(request).execute();
                    if (response.isSuccessful()) {
                        String responseBody = response.body().string();
                        processGoogleCloudResponse(responseBody);
                    } else {
                        Log.e(TAG, "Google Cloud API error: " + response.code() + " " + response.message());
                        sendEvent("onError", createErrorMap("API_ERROR", "Google Cloud API请求失败: " + response.code()));
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error sending audio to Google Cloud", e);
                    sendEvent("onError", createErrorMap("NETWORK_ERROR", "网络请求失败: " + e.getMessage()));
                }
            });
            
        } catch (Exception e) {
            Log.e(TAG, "Error preparing Google Cloud request", e);
            sendEvent("onError", createErrorMap("REQUEST_ERROR", "请求准备失败: " + e.getMessage()));
        }
    }
    
    private void processGoogleCloudResponse(String responseBody) {
        try {
            JSONObject response = new JSONObject(responseBody);
            
            if (response.has("results")) {
                JSONArray results = response.getJSONArray("results");
                
                WritableMap params = Arguments.createMap();
                WritableArray resultsArray = Arguments.createArray();
                
                for (int i = 0; i < results.length(); i++) {
                    JSONObject result = results.getJSONObject(i);
                    JSONArray alternatives = result.getJSONArray("alternatives");
                    
                    for (int j = 0; j < alternatives.length(); j++) {
                        JSONObject alternative = alternatives.getJSONObject(j);
                        
                        WritableMap resultMap = Arguments.createMap();
                        resultMap.putString("text", alternative.getString("transcript"));
                        
                        if (alternative.has("confidence")) {
                            resultMap.putDouble("confidence", alternative.getDouble("confidence"));
                        } else {
                            resultMap.putDouble("confidence", 0.0);
                        }
                        
                        resultsArray.pushMap(resultMap);
                    }
                }
                
                params.putArray("results", resultsArray);
                sendEvent("onResults", params);
            }
            
        } catch (JSONException e) {
            Log.e(TAG, "Error parsing Google Cloud response", e);
            sendEvent("onError", createErrorMap("PARSE_ERROR", "响应解析失败: " + e.getMessage()));
        }
    }
    
    private WritableMap createErrorMap(String error, String message) {
        WritableMap errorMap = Arguments.createMap();
        errorMap.putString("error", error);
        errorMap.putString("message", message);
        return errorMap;
    }
    
    private boolean checkPermission() {
        return ContextCompat.checkSelfPermission(reactContext, Manifest.permission.RECORD_AUDIO) 
               == PackageManager.PERMISSION_GRANTED;
    }
    
    private void requestPermission(Promise promise) {
        if (getCurrentActivity() != null) {
            ActivityCompat.requestPermissions(
                getCurrentActivity(),
                new String[]{Manifest.permission.RECORD_AUDIO},
                PERMISSION_REQUEST_CODE
            );
            promise.reject("PERMISSION_DENIED", "需要麦克风权限");
        } else {
            promise.reject("NO_ACTIVITY", "无法请求权限");
        }
    }
    
    private boolean checkNetworkConnection() {
        try {
            ConnectivityManager connectivityManager = (ConnectivityManager) reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (connectivityManager != null) {
                NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
                return activeNetworkInfo != null && activeNetworkInfo.isConnected();
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking network connection", e);
        }
        return false;
    }
    
    private String getDeviceInfo() {
        try {
            return Build.MANUFACTURER + " " + Build.MODEL + " (Android " + Build.VERSION.RELEASE + ")";
        } catch (Exception e) {
            return "Unknown device";
        }
    }
    
    private boolean isAvailable() {
        return checkPermission() && checkNetworkConnection() && !currentApiKey.equals("YOUR_GOOGLE_CLOUD_API_KEY");
    }
    
    private void sendEvent(String eventName, WritableMap params) {
        mainHandler.post(() -> {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        });
    }
} 