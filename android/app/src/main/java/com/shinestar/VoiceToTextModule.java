package com.shinestar;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
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


import java.util.ArrayList;
import java.util.Locale;

public class VoiceToTextModule extends ReactContextBaseJavaModule {
    private static final String TAG = "VoiceToTextModule";
    private static final int PERMISSION_REQUEST_CODE = 123;
    
    private SpeechRecognizer speechRecognizer;
    private boolean isListening = false;
    private String currentLanguage = "en-US";
    
    private final ReactApplicationContext reactContext;
    
    public VoiceToTextModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }
    
    @Override
    public String getName() {
        return "VoiceToTextModule";
    }
    
    @ReactMethod
    public void startListening(Promise promise) {
        if (isListening) {
            promise.reject("ALREADY_LISTENING", "Speech recognition is already active");
            return;
        }
        
        if (!checkPermission()) {
            requestPermission(promise);
            return;
        }
        
        // 确保在主线程上运行
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (speechRecognizer == null) {
                        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactContext);
                        speechRecognizer.setRecognitionListener(new RecognitionListener() {
                            @Override
                            public void onReadyForSpeech(Bundle bundle) {
                                sendEvent("onReadyForSpeech", null);
                            }
                            
                            @Override
                            public void onBeginningOfSpeech() {
                                sendEvent("onBeginningOfSpeech", null);
                            }
                            
                            @Override
                            public void onRmsChanged(float rmsdB) {
                                WritableMap params = Arguments.createMap();
                                params.putDouble("rmsdB", rmsdB);
                                sendEvent("onRmsChanged", params);
                            }
                            
                            @Override
                            public void onBufferReceived(byte[] buffer) {
                                // Not used in most cases
                            }
                            
                            @Override
                            public void onEndOfSpeech() {
                                sendEvent("onEndOfSpeech", null);
                            }
                            
                            @Override
                            public void onError(int error) {
                                isListening = false;
                                WritableMap params = Arguments.createMap();
                                params.putInt("error", error);
                                String errorMessage = getErrorMessage(error);
                                params.putString("message", errorMessage);
                                sendEvent("onError", params);
                                promise.reject("SPEECH_ERROR", errorMessage);
                            }
                            
                            @Override
                            public void onResults(Bundle results) {
                                isListening = false;
                                ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                                float[] confidence = results.getFloatArray(SpeechRecognizer.CONFIDENCE_SCORES);
                                
                                WritableMap params = Arguments.createMap();
                                WritableArray resultsArray = Arguments.createArray();
                                
                                if (matches != null) {
                                    for (int i = 0; i < matches.size(); i++) {
                                        WritableMap result = Arguments.createMap();
                                        result.putString("text", matches.get(i));
                                        if (confidence != null && i < confidence.length) {
                                            result.putDouble("confidence", confidence[i]);
                                        } else {
                                            result.putDouble("confidence", 0.0);
                                        }
                                        resultsArray.pushMap(result);
                                    }
                                }
                                
                                params.putArray("results", resultsArray);
                                sendEvent("onResults", params);
                                promise.resolve(params);
                            }
                            
                            @Override
                            public void onPartialResults(Bundle partialResults) {
                                ArrayList<String> matches = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                                
                                WritableMap params = Arguments.createMap();
                                WritableArray resultsArray = Arguments.createArray();
                                
                                if (matches != null) {
                                    for (String match : matches) {
                                        WritableMap result = Arguments.createMap();
                                        result.putString("text", match);
                                        result.putDouble("confidence", 0.0);
                                        resultsArray.pushMap(result);
                                    }
                                }
                                
                                params.putArray("results", resultsArray);
                                sendEvent("onPartialResults", params);
                            }
                            
                            @Override
                            public void onEvent(int eventType, Bundle bundle) {
                                // Not used in most cases
                            }
                        });
                    }
                    
                    Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, currentLanguage);
                    intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
                    intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
                    // 添加更多配置来改善识别
                    intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 3000); // 最少3秒
                    intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 1500); // 1.5秒静音后结束
                    intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 1000); // 1秒可能完成
                    intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 500); // 0.5秒可能完成
                    
                    speechRecognizer.startListening(intent);
                    isListening = true;
                    
                    sendEvent("onStart", null);
                    promise.resolve("Started listening");
                    
                } catch (Exception e) {
                    Log.e(TAG, "Error starting speech recognition", e);
                    promise.reject("START_ERROR", e.getMessage());
                }
            }
        });
    }
    
    @ReactMethod
    public void stopListening(Promise promise) {
        if (!isListening) {
            promise.reject("NOT_LISTENING", "Speech recognition is not active");
            return;
        }
        
        // 确保在主线程上运行
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (speechRecognizer != null) {
                        speechRecognizer.stopListening();
                        isListening = false;
                        sendEvent("onStop", null);
                        promise.resolve("Stopped listening");
                    } else {
                        promise.reject("NO_RECOGNIZER", "Speech recognizer not initialized");
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error stopping speech recognition", e);
                    promise.reject("STOP_ERROR", e.getMessage());
                }
            }
        });
    }
    
    @ReactMethod
    public void destroy(Promise promise) {
        // 确保在主线程上运行
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (speechRecognizer != null) {
                        speechRecognizer.destroy();
                        speechRecognizer = null;
                    }
                    isListening = false;
                    sendEvent("onDestroy", null);
                    promise.resolve("Destroyed");
                } catch (Exception e) {
                    Log.e(TAG, "Error destroying speech recognizer", e);
                    promise.reject("DESTROY_ERROR", e.getMessage());
                }
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
            // 基本检查
            boolean basicAvailable = SpeechRecognizer.isRecognitionAvailable(reactContext);
            
            // 详细检查
            WritableMap result = Arguments.createMap();
            result.putBoolean("available", basicAvailable);
            
            // 检查权限
            boolean hasPermission = checkPermission();
            result.putBoolean("hasPermission", hasPermission);
            
            // 检查网络连接
            boolean hasNetwork = checkNetworkConnection();
            result.putBoolean("hasNetwork", hasNetwork);
            
            // 检查Google Play Services
            boolean hasGoogleServices = checkGooglePlayServices();
            result.putBoolean("hasGoogleServices", hasGoogleServices);
            
            // 检查设备信息
            String deviceInfo = getDeviceInfo();
            result.putString("deviceInfo", deviceInfo);
            
            // 如果基本检查失败，提供详细原因
            if (!basicAvailable) {
                String reason = getUnavailableReason(hasPermission, hasNetwork, hasGoogleServices);
                result.putString("reason", reason);
            }
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("CHECK_ERROR", e.getMessage());
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
    
    private boolean checkGooglePlayServices() {
        try {
            // 简化检查，不依赖Google Play Services库
            // 中国设备通常没有Google Play Services
            return false;
        } catch (Exception e) {
            Log.e(TAG, "Error checking Google Play Services", e);
            return false;
        }
    }
    
    private String getDeviceInfo() {
        try {
            return Build.MANUFACTURER + " " + Build.MODEL + " (Android " + Build.VERSION.RELEASE + ")";
        } catch (Exception e) {
            return "Unknown device";
        }
    }
    
    private String getUnavailableReason(boolean hasPermission, boolean hasNetwork, boolean hasGoogleServices) {
        if (!hasPermission) {
            return "缺少麦克风权限";
        }
        if (!hasNetwork) {
            return "网络连接不可用";
        }
        if (!hasGoogleServices) {
            return "Google Play Services不可用（中国设备常见问题）";
        }
        return "语音识别服务不可用";
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
            promise.reject("PERMISSION_DENIED", "Microphone permission required");
        } else {
            promise.reject("NO_ACTIVITY", "No activity available for permission request");
        }
    }
    
    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
    
    private String getErrorMessage(int error) {
        switch (error) {
            case SpeechRecognizer.ERROR_AUDIO:
                return "音频录制错误，请检查麦克风权限";
            case SpeechRecognizer.ERROR_CLIENT:
                return "客户端错误";
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                return "权限不足，请授予麦克风权限";
            case SpeechRecognizer.ERROR_NETWORK:
                return "网络错误，请检查网络连接";
            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                return "网络超时，请检查网络连接";
            case SpeechRecognizer.ERROR_NO_MATCH:
                return "未识别到语音，请说话更清晰或时间更长一些";
            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                return "识别服务忙碌，请稍后再试";
            case SpeechRecognizer.ERROR_SERVER:
                return "服务器错误";
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                return "语音超时，请说话时间更长一些";
            default:
                return "未知错误";
        }
    }
} 