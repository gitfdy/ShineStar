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
import theme from '../styles/theme';
import BasePage from '../components/BasePage';
import {StatusBarStyles} from '../constants/StatusBarStyles';
import {useTranslation} from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const {width, height} = Dimensions.get('window');

const OnboardingScreen = observer(() => {
  const {appStore} = useStore();
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

  // 初始化打字效果
  useEffect(() => {
    startTypingEffect();
    
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
      showRadialMenu: true,
    },
    {
      id: 1,
      title: t('onboarding.step2.title'),
      subtitle: t('onboarding.step2.subtitle'),
      buttonText: t('onboarding.step2.buttonText'),
      showWaveform: true,
    },
    {
      id: 2,
      title: t('onboarding.step3.title'),
      subtitle: t('onboarding.step3.subtitle'),
      buttonText: t('onboarding.step3.buttonText'),
      showSummary: true,
    },
    {
      id: 3,
      title: t('onboarding.step4.title'),
      subtitle: t('onboarding.step4.subtitle'),
      buttonText: t('onboarding.step4.buttonText'),
      showAIChat: true,
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
            startTypingEffect();
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
          startTypingEffect();
        });
      });
    }
  };

  const startTypingEffect = () => {
    const currentStepData = onboardingSteps[currentStep];
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
      ])
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
    }, 60);
    
    typingRef.current = typeInterval;
  };

  // 监听语言变化，重新开始打字效果
  useEffect(() => {
    if (!isTyping) {
      startTypingEffect();
    }
  }, [t]);

  const renderRadialMenu = () => (
    <View style={styles.radialContainer}>
      <View style={styles.centralButton}>
        <View style={styles.centralIcon}>
          <Text style={styles.centralIconText}>🎤</Text>
        </View>
      </View>

      {/* 径向菜单按钮 */}
      <View style={styles.radialButtons}>
        <TouchableOpacity style={[styles.radialButton, styles.topLeft]}>
          <Text style={styles.radialButtonText}>转录</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.radialButton, styles.topRight]}>
          <Text style={styles.radialButtonText}>总结</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.radialButton, styles.bottomLeft]}>
          <Text style={styles.radialButtonText}>AI 聊天</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.radialButton, styles.bottomRight]}>
          <Text style={styles.radialButtonText}>翻译</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderWaveform = () => (
    <View style={styles.waveformContainer}>
      <View style={styles.waveform}>
        {[...Array(20)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              {
                height: Math.random() * 40 + 10,
                backgroundColor:
                  index < 10
                    ? theme.colors.primary
                    : theme.colors.neutral.lightGray,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.transcriptionArea}>
        <View style={styles.transcriptionBubble}>
          <Text style={styles.speakerText}>演讲者1 0:10</Text>
          <Text style={styles.transcriptionText}>
            欢迎来到今天的教程课程。我们将介绍如何设置项目的基本步骤。
          </Text>
        </View>
        <View style={styles.transcriptionBubble}>
          <Text style={styles.speakerText}>演讲者2 0:47</Text>
          <Text style={styles.transcriptionText}>
            所以，首先您需要确保已安装所有软件。
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>60分钟</Text>
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>教程录制</Text>
          <View style={styles.miniWaveform}>
            {[...Array(15)].map((_, index) => (
              <View
                key={index}
                style={[styles.miniBar, {height: Math.random() * 20 + 5}]}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.summaryButtons}>
        <TouchableOpacity style={styles.summaryButton}>
          <Text style={styles.summaryButtonText}>简短总结</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.summaryButton}>
          <Text style={styles.summaryButtonText}>行动要点</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.summaryButton}>
          <Text style={styles.summaryButtonText}>关键主题</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAIChat = () => (
    <View style={styles.aiChatContainer}>
      <View style={styles.aiChatCard}>
        <View style={styles.aiChatHeader}>
          <Text style={styles.aiChatTitle}>AI 聊天</Text>
        </View>
        <Text style={styles.aiChatContent}>
          本周的任务是完成项目设置。任务包括：
        </Text>
        <View style={styles.taskList}>
          <Text style={styles.taskItem}>1. 安装必要的工具和软件</Text>
          <Text style={styles.taskItem}>2. 为即将到来的工作配置您的环境</Text>
          <Text style={styles.taskItem}>3. 确保一切都已正确设置</Text>
        </View>
      </View>

      <View style={styles.questionBubbles}>
        <TouchableOpacity style={styles.questionBubble}>
          <Text style={styles.questionText}>推荐的行动?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.questionBubble}>
          <Text style={styles.questionText}>分配了哪些任务?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.questionBubble}>
          <Text style={styles.questionText}>有哪些先决条件?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.questionBubble}>
          <Text style={styles.questionText}>提到了哪些关键步骤?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTopContent = index => {
    const currentStepData = onboardingSteps[index];

    return (
      <View style={styles.topSection}>
        {currentStepData.showRadialMenu && renderRadialMenu()}
        {currentStepData.showWaveform && renderWaveform()}
        {currentStepData.showSummary && renderSummary()}
        {currentStepData.showAIChat && renderAIChat()}
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
              transform: [
                {translateX: textTranslateX},
                {scale: textScale},
              ],
            }
          ]}
        >
          <Text style={styles.bottomTitle}>{currentStepData.title}</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.bottomSubtitle}>
              {displayedText}
            </Text>
            {isTyping && (
              <Animated.View 
                style={[
                  styles.cursor,
                  {
                    opacity: cursorOpacity,
                  }
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
                {scale: fadeOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                })},
              ],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.smallButton} 
            onPress={handleNext}
            activeOpacity={0.7}
          >
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
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <BasePage barStyle={StatusBarStyles.DARK_CONTENT} style={styles.container}>
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
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
          height: 200, // 固定高度
        }}
        pointerEvents="box-none"
      >
        <View pointerEvents="box-none" style={{flex: 1}} />
        <View pointerEvents="auto" style={{height: 100}}>
          <View style={{marginBottom: theme.spacing.md}}>
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
    backgroundColor: theme.colors.neutral.background,
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
    paddingHorizontal: theme.spacing.lg,
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
    marginRight: theme.spacing.md,
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
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.primary,
    fontWeight: '500',
  },

  // 波形样式
  waveformContainer: {
    width: '100%',
    alignItems: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    marginBottom: theme.spacing.lg,
  },
  waveformBar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  transcriptionArea: {
    width: '100%',
  },
  transcriptionBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  speakerText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  transcriptionText: {
    fontSize: 14,
    color: theme.colors.neutral.black,
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
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.sm,
  },
  miniWaveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 30,
  },
  miniBar: {
    width: 2,
    backgroundColor: theme.colors.neutral.black,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  summaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  summaryButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryButtonText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },

  // AI聊天样式
  aiChatContainer: {
    width: '100%',
  },
  aiChatCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiChatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  aiChatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  aiChatContent: {
    fontSize: 14,
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.sm,
  },
  taskList: {
    marginTop: theme.spacing.sm,
  },
  taskItem: {
    fontSize: 14,
    color: theme.colors.neutral.black,
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    width: '48%',
  },
  questionText: {
    fontSize: 12,
    color: theme.colors.neutral.darkGray,
    textAlign: 'center',
  },

  // 底部文字样式
  bottomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.neutral.black,
    textAlign: 'left',
    marginBottom: theme.spacing.xs,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bottomSubtitle: {
    fontSize: 14,
    color: theme.colors.neutral.darkGray,
    textAlign: 'left',
    lineHeight: 20,
  },
  cursor: {
    width: 2,
    height: 16,
    backgroundColor: theme.colors.primary,
    marginLeft: 2,
    borderRadius: 1,
  },

  // 按钮样式
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  smallButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
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
  skipButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  skipButtonText: {
    color: theme.colors.neutral.gray,
    fontSize: 14,
  },


  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  lineIndicator: {
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.primary,
    marginRight: 8,
  },
});

export default OnboardingScreen;
