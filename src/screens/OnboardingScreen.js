import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  ImageBackground
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useStore} from '../stores/StoreProvider';
import BasePage from '../components/BasePage';
import {useTranslation} from 'react-i18next';
import LottieView from 'lottie-react-native';
import { getCurrentTheme, getThemeColor, getThemeSpacing } from '../utils/themeUtils';

const {width, height} = Dimensions.get('window');

const OnboardingScreen = observer(() => {
  const {appStore, themeStore} = useStore();
  const {t} = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const textTranslateX = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(1)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef(null);
  const currentIndexRef = useRef(0);
  const animationRef = useRef(null);

  // 获取当前主题
  const currentTheme = getCurrentTheme(themeStore);

  // 动态生成样式
  const getStyles = () => {
    return {
      container: {
        flex: 1,
      },
      scrollContent: {
        flexGrow: 1,
      },
      stepContainer: {
        width: width,
        flex: 1,
      },
      topSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 120,
        paddingHorizontal: getThemeSpacing(themeStore, 'lg'),
      },
      bottomContentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        height: 100,
      },
      textContainer: {
        flex: 1,
        marginRight: getThemeSpacing(themeStore, 'md'),
        justifyContent: 'flex-start',
      },
      buttonContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      bottomTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: getThemeSpacing(themeStore, 'xs'),
        color: getThemeColor(themeStore, 'neutral.black'),
      
      },
      bottomSubtitle: {
        fontSize: 16,
        textAlign: 'left',
        lineHeight: 22,
        marginBottom: getThemeSpacing(themeStore, 'xs'),
        color: getThemeColor(themeStore, 'neutral.darkGray'),
     
      },
      smallButton: {
        backgroundColor: getThemeColor(themeStore, 'primary'),
        borderRadius: 12,
        paddingHorizontal: getThemeSpacing(themeStore, 'md'),
        paddingVertical: getThemeSpacing(themeStore, 'sm'),
        shadowColor: getThemeColor(themeStore, 'primary'),
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
      smallButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
      },
      welcomeContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: height / 2 - 270,
        opacity: 0.9,
      },
      welcomeText: {
        fontSize: 20,
        fontWeight: '500',
        color: getThemeColor(themeStore, 'neutral.darkGray'),
        textAlign: 'center',
        opacity: 0.8,
        marginTop: 16,
        fontFamily: 'Courier Prime',
        lineHeight: 30,
      },
      indicatorsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      lineIndicator: {
        height: 4,
        borderRadius: 2,
        backgroundColor: getThemeColor(themeStore, 'primary'),
        marginRight: 8,
        shadowColor: getThemeColor(themeStore, 'primary'),
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
      },
      waveContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width*3,
        height: width*3,
        overflow: 'hidden',
        opacity: 0.06,
      },
      waveAnimation: {
        width: width*3,
        height: width*3,
        position: 'absolute',
        left: 0,
        top: -width*1.5,
      },
    };
  };

  const styles = getStyles();

  // 初始化打字效果
  useEffect(() => {
    startTypingEffect(currentStep);

    // 清理函数
    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current);
      }
    };
  }, []);

  const onboardingSteps = [
    {
      id: 0,
      title: t('onboarding.step1.title'),
      subtitle: t('onboarding.step1.subtitle'),
      description: t('onboarding.step1.description'),
      buttonText: t('onboarding.step1.buttonText'),
      showWelcome: true,
      icon: 'idea'
    },
    {
      id: 1,
      title: t('onboarding.step2.title'),
      subtitle: t('onboarding.step2.subtitle'),
      description: t('onboarding.step2.description'),
      buttonText: t('onboarding.step2.buttonText'),
      showRecord: true,
      icon: 'record'
    },
    {
      id: 2,
      title: t('onboarding.step3.title'),
      subtitle: t('onboarding.step3.subtitle'),
      description: t('onboarding.step3.description'),
      buttonText: t('onboarding.step3.buttonText'),
      showDataSafe: true,
      icon: 'security'
    },
    {
      id: 3,
      title: t('onboarding.step4.title'),
      subtitle: t('onboarding.step4.subtitle'),
      description: t('onboarding.step4.description'),
      buttonText: t('onboarding.step4.buttonText'),
      showEmpower: true,
      icon: 'ai'
    },
  ];

  const handleNext = () => {
    console.log('Button clicked! Current step:', currentStep);
    if (currentStep < onboardingSteps.length - 1) {
      const nextIndex = currentStep + 1;

      // 优雅的按钮点击动画
      Animated.sequence([
        Animated.timing(fadeOpacity, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 动画完成后更新步骤
        setCurrentStep(nextIndex);
        // 优雅的 fadeIn 动画
        Animated.parallel([
          Animated.timing(fadeOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(textTranslateX, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(textScale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // 开始打字效果
          startTypingEffect(nextIndex);
        });
      });

      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      // 完成引导，进入主应用
      appStore.completeOnboarding();
    }
  };

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.setValue(offsetX);
    const index = Math.round(offsetX / width);
    if (index !== currentStep) {
      // 触发文字动画 - 优雅的 fadeOut/fadeIn 效果
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateX, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(index);
        // 优雅的 fadeIn 动画
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(textTranslateX, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // 开始打字效果
          startTypingEffect(index);
        });
      });
    }
  };

  const startTypingEffect = _currentStep => {
    const currentStepData = onboardingSteps[_currentStep];

    const fullText = currentStepData.subtitle;

    // 清除之前的定时器
    if (typingRef.current) {
      clearInterval(typingRef.current);
    }

    // 停止之前的动画
    cursorOpacity.stopAnimation();
    setDisplayedText('');
    setIsTyping(true);
    currentIndexRef.current = 0;

    // 开始光标闪烁动画
    const cursorAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    cursorAnimation.start();

    const typeInterval = setInterval(() => {
      if (currentIndexRef.current < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndexRef.current + 1));
        currentIndexRef.current++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        cursorAnimation.stop();
        cursorOpacity.setValue(0); // 隐藏光标
        typingRef.current = null;
      }
    }, 30);

    typingRef.current = typeInterval;
  };

  // 监听语言变化，重新开始打字效果
  useEffect(() => {
    if (!isTyping) {
      startTypingEffect(currentStep);
    }
  }, [t]);

  const renderEmpower = () => (
    <View style={styles.welcomeContainer}>
      <LottieView
        ref={animationRef}
        source={require('../lottie/HandshakeAnimation.json')}
        autoPlay
        loop
        style={{width: 300, height: 300}}
      />
      <Text style={styles.welcomeText}>{t('onboarding.step4.description')}</Text>
    </View>
  );

  const renderDataSafe = () => (
    <View style={styles.welcomeContainer}>
      <LottieView
        ref={animationRef}
        source={require('../lottie/SecurityAnimation.json')}
        autoPlay
        loop
        style={{width: 300, height: 300}}
      />
      <Text style={styles.welcomeText}>{t('onboarding.step3.description')}</Text>
    </View>
  );

  const renderRecord = () => (
    <View style={styles.welcomeContainer}>
      <LottieView
        ref={animationRef}
        source={require('../lottie/IllustrationAnimation.json')}
        autoPlay
        loop
        style={{width: 300, height: 300}}
      />
      <Text style={styles.welcomeText}>{t('onboarding.step2.description')}</Text>
    </View>
  );

  const renderWelcome = () => (
    <View style={styles.welcomeContainer}>
      <LottieView
        ref={animationRef}
        source={require('../lottie/IdeaAnimation.json')}
        autoPlay
        loop
        style={{width: 300, height: 300}}
      />
      <Text style={styles.welcomeText}>{t('onboarding.step1.description')}</Text>
    </View>
  );

  const renderTopContent = index => {
    const currentStepData = onboardingSteps[index];

    return (
      <View style={styles.topSection}>
        {currentStepData.showWelcome && renderWelcome()}
        {currentStepData.showRecord && renderRecord()}
        {currentStepData.showDataSafe && renderDataSafe()}
        {currentStepData.showEmpower && renderEmpower()}
      </View>
    );
  };

  const renderBottomContent = () => {
    const currentStepData = onboardingSteps[currentStep];

    return (
      <View style={styles.bottomContentContainer}>
        {/* 文字区域 */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{translateX: textTranslateX}, {scale: textScale}],
            },
          ]}>
          <Text style={styles.bottomTitle}>
            {currentStepData.title}
          </Text>
          <Text style={styles.bottomSubtitle}>
            {currentStepData.subtitle}
          </Text>
        </Animated.View>

        {/* 按钮区域 */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [
                {
                  scaleX: fadeOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={handleNext}
            activeOpacity={0.7}>
            <Animated.Text 
              style={[
                styles.smallButtonText,
                {
                  opacity: fadeOpacity,
                },
              ]}>
              {currentStepData.buttonText}
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderStep = index => {
    return (
      <View key={index} style={styles.stepContainer}>
        {renderTopContent(index)}
      </View>
    );
  };

  // 动画指示器
  const renderAnimatedIndicators = () => {
    return (
      <View style={styles.indicatorsContainer}>
        {onboardingSteps.map((_, index) => {
          const width = scrollX.interpolate({
            inputRange: [
              (index - 1) * Dimensions.get('window').width,
              index * Dimensions.get('window').width,
              (index + 1) * Dimensions.get('window').width,
            ],
            outputRange: [20, 40, 20],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * Dimensions.get('window').width,
              index * Dimensions.get('window').width,
              (index + 1) * Dimensions.get('window').width,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * Dimensions.get('window').width,
              index * Dimensions.get('window').width,
              (index + 1) * Dimensions.get('window').width,
            ],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.lineIndicator,
                {
                  width,
                  opacity,
                  transform: [{scale}],
                  backgroundColor:
                    getThemeColor(themeStore, 'primary'),
                },
              ]}
            />
          );
        })}
      </View>
    );
  };
  useEffect(() => {
    animationRef.current?.play();

    // Or set a specific startFrame and endFrame with:
  }, []);

  const backgroundTranslateX = scrollX.interpolate({
    inputRange: [0, width * 3],
    outputRange: [0, -width * 1.5], // Adjust multiplier for desired movement speed; 1.5 makes it move slower than the scroll
    extrapolate: 'clamp',
    // For elastic feel, we can use easing in the scroll handler if needed, but interpolate provides smooth translation
  });

  return (
    <BasePage
      barStyle={themeStore?.statusBarStyle || 'dark-content'}
      style={[
        styles.container,
        {
          backgroundColor: getThemeColor(themeStore, 'neutral.background'),
        },
      ]}>
      {/* Dynamic Background */}
      <View 
        style={styles.waveContainer}
      >
        <LottieView
          source={require('../lottie/WaveAnimation.json')}
          autoPlay
          loop
          style={styles.waveAnimation}
          colorFilters={[
            {
              keypath: '*',
              color: getThemeColor(themeStore, 'primary')
            }
          ]}
        />
      </View>

      {/* 顶部内容区域 - 正常切换 */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{flex: 1, backgroundColor: 'transparent'}}
        contentContainerStyle={styles.scrollContent}>
        {onboardingSteps.map((_, index) => renderStep(index))}
      </ScrollView>

      {/* 底部文字和按钮区域 */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingHorizontal: getThemeSpacing(themeStore, 'lg'),
          paddingBottom: getThemeSpacing(themeStore, 'xl'),
          height: 200,
        }}
        pointerEvents="box-none">
        <View pointerEvents="box-none" style={{flex: 1}} />
        <View pointerEvents="auto" style={{height: 100}}>
          <View style={{marginBottom: getThemeSpacing(themeStore, 'md')}}>
            {renderAnimatedIndicators()}
          </View>
          {renderBottomContent()}
        </View>
      </View>
    </BasePage>
  );
});

export default OnboardingScreen;
