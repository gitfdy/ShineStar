import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useStore} from '../stores/StoreProvider';
import {lightTheme} from '../styles/theme';
import BasePage from '../components/BasePage';
import {StatusBarStyles} from '../constants/StatusBarStyles';
import {useTranslation} from 'react-i18next';
import LottieView from 'lottie-react-native';

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
      buttonText: t('onboarding.step1.buttonText'),
      showWelcome: true,
    },
    {
      id: 1,
      title: t('onboarding.step2.title'),
      subtitle: t('onboarding.step2.subtitle'),
      buttonText: t('onboarding.step2.buttonText'),
      showRecord: true,
    },
    {
      id: 2,
      title: t('onboarding.step3.title'),
      subtitle: t('onboarding.step3.subtitle'),
      buttonText: t('onboarding.step3.buttonText'),
      showDataSafe: true,
    },
    {
      id: 3,
      title: t('onboarding.step4.title'),
      subtitle: t('onboarding.step4.subtitle'),
      buttonText: t('onboarding.step4.buttonText'),
      showEmpower: true,
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
        source={require('../lottie/IdeaAnimation.json')}
        autoPlay
        loop
        style={{width: 300, height: 300}}
      />
      <Text style={styles.welcomeText}>{t('onboarding.step4.subtitle')}</Text>
    </View>
  );

  const renderDataSafe = () => (
    <View style={styles.welcomeContainer}>
      <LottieView
        ref={animationRef}
        source={require('../lottie/IdeaAnimation.json')}
        autoPlay
        loop
        style={{width: 300, height: 300}}
      />
      <Text style={styles.welcomeText}>{t('onboarding.step3.subtitle')}</Text>
    </View>
  );

  const renderRecord = () => (
    <View style={styles.welcomeContainer}>
      <LottieView
        ref={animationRef}
        source={require('../lottie/IdeaAnimation.json')}
        autoPlay
        loop
        style={{width: 300, height: 300}}
      />
      <Text style={styles.welcomeText}>{t('onboarding.step2.subtitle')}</Text>
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
      <Text style={styles.welcomeText}>{t('onboarding.step1.subtitle')}</Text>
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
          <Text
            style={[
              styles.bottomTitle,
              {
                color:
                  themeStore?.currentTheme?.colors?.neutral?.black || '#000000',
              },
            ]}>
            {currentStepData.title}
          </Text>
          <View style={styles.subtitleContainer}>
            <Text
              style={[
                styles.bottomSubtitle,
                {
                  color:
                    themeStore?.currentTheme?.colors?.neutral?.darkGray ||
                    '#1C1C1E',
                },
              ]}>
              {displayedText}
            </Text>
            {isTyping && (
              <Animated.View
                style={[
                  styles.cursor,
                  {
                    opacity: cursorOpacity,
                    backgroundColor:
                      themeStore?.currentTheme?.colors?.primary || '#007AFF',
                  },
                ]}
              />
            )}
          </View>
        </Animated.View>

        {/* 按钮区域 */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeOpacity,
              transform: [
                {
                  scale: fadeOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={handleNext}
            activeOpacity={0.7}>
            <Text style={styles.smallButtonText}>
              {currentStepData.buttonText}
            </Text>
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
                    themeStore?.currentTheme?.colors?.primary || '#007AFF',
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

  return (
    <BasePage
      barStyle={themeStore?.statusBarStyle || 'dark-content'}
      style={[
        styles.container,
        {
          backgroundColor:
            themeStore?.currentTheme?.colors?.neutral?.background || '#F2F2F7',
        },
      ]}>
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
          paddingHorizontal: lightTheme.spacing.lg,
          paddingBottom: lightTheme.spacing.xl,
          height: 200, // 固定高度
        }}
        pointerEvents="box-none">
        <View pointerEvents="box-none" style={{flex: 1}} />
        <View pointerEvents="auto" style={{height: 100}}>
          <View style={{marginBottom: lightTheme.spacing.md}}>
            {renderAnimatedIndicators()}
          </View>
          {renderBottomContent()}
        </View>
      </View>
    </BasePage>
  );
});

const styles = StyleSheet.create({
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

  // 顶部内容区域
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 120,
    paddingHorizontal: lightTheme.spacing.lg,
  },

  // 底部内容容器
  bottomContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 80, // 固定高度
  },

  // 文字容器
  textContainer: {
    flex: 1,
    marginRight: lightTheme.spacing.md,
    justifyContent: 'flex-start',
  },

  // 按钮容器
  buttonContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  // 径向菜单样式
  radialContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: lightTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centralIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralIconText: {
    fontSize: 24,
  },
  radialButtons: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  radialButton: {
    position: 'absolute',
    width: 60,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  topLeft: {top: 20, left: 20},
  topRight: {top: 20, right: 20},
  bottomLeft: {bottom: 20, left: 20},
  bottomRight: {bottom: 20, right: 20},
  radialButtonText: {
    fontSize: 12,
    color: lightTheme.colors.primary,
    fontWeight: '500',
  },

  // 波形样式
  waveformContainer: {
    width: '100%',
    alignItems: 'center',
  },
  transcriptionArea: {
    width: '100%',
  },
  transcriptionBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: lightTheme.spacing.md,
    marginBottom: lightTheme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  speakerText: {
    fontSize: 12,
    color: lightTheme.colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  transcriptionText: {
    fontSize: 14,
    color: lightTheme.colors.neutral.black,
    lineHeight: 20,
  },

  // 总结样式
  summaryContainer: {
    width: '100%',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: lightTheme.spacing.lg,
    marginBottom: lightTheme.spacing.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.colors.primary,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: lightTheme.colors.neutral.black,
    marginBottom: lightTheme.spacing.sm,
  },

  summaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  summaryButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryButtonText: {
    fontSize: 12,
    color: lightTheme.colors.primary,
    fontWeight: '500',
  },

  // AI聊天样式
  aiChatContainer: {
    width: '100%',
  },
  aiChatCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: lightTheme.spacing.lg,
    marginBottom: lightTheme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiChatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  aiChatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.colors.primary,
  },
  aiChatContent: {
    fontSize: 14,
    color: lightTheme.colors.neutral.black,
    marginBottom: lightTheme.spacing.sm,
  },
  taskList: {
    marginTop: lightTheme.spacing.sm,
  },
  taskItem: {
    fontSize: 14,
    color: lightTheme.colors.neutral.black,
    marginBottom: 4,
  },
  questionBubbles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  questionBubble: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.sm,
    marginBottom: lightTheme.spacing.sm,
    width: '48%',
  },
  questionText: {
    fontSize: 12,
    color: lightTheme.colors.neutral.darkGray,
    textAlign: 'center',
  },

  // 底部文字样式
  bottomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: lightTheme.spacing.xs,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bottomSubtitle: {
    fontSize: 14,
    textAlign: 'left',
    lineHeight: 20,
  },
  cursor: {
    width: 2,
    height: 16,
    marginLeft: 2,
    borderRadius: 1,
  },
  smallButton: {
    backgroundColor: lightTheme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // 欢迎页样式
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: height / 2 - 270,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: lightTheme.colors.primary,
    textAlign: 'center',
  },

  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  lineIndicator: {
    height: 3,
    borderRadius: 1.5,
    backgroundColor: lightTheme.colors.primary,
    marginRight: 8,
  },
});

export default OnboardingScreen;
