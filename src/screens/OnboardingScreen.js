import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useStore} from '../stores/StoreProvider';
import theme from '../styles/theme';
import BasePage from '../components/BasePage';
import { StatusBarStyles } from '../constants/StatusBarStyles';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  runOnJS,
  withTiming,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const OnboardingScreen = observer(() => {
  const {appStore} = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef(null);
  const scrollX = useSharedValue(0);
  const fadeOpacity = useSharedValue(1);
  const textOpacity = useSharedValue(1);
  const textTranslateY = useSharedValue(0);
  const currentStepValue = useSharedValue(0);

  const onboardingSteps = [
    {
      id: 0,
      title: '欢迎来到 ShineStar',
      subtitle: '将语音转录为文本，快速、轻松、无忧地获取即时笔记！',
      buttonText: '开始使用',
      showRadialMenu: true,
    },
    {
      id: 1,
      title: '立即录音与转录',
      subtitle: '准确的转录，带时间戳和说话者识别',
      buttonText: '继续',
      showWaveform: true,
    },
    {
      id: 2,
      title: '将数小时总结为数分钟',
      subtitle: '一键获取自动摘要、行动项目和关键主题见解！',
      buttonText: '继续',
      showSummary: true,
    },
    {
      id: 3,
      title: '与您的笔记进行 AI 聊天',
      subtitle: '询问任何问题，从您的转录中通过AI驱动的聊天立即获取答案',
      buttonText: '开始体验',
      showAIChat: true,
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      const nextIndex = currentStep + 1;

      // 淡出动画
      fadeOpacity.value = withTiming(
        0,
        {
          duration: 200,
          easing: Easing.out(Easing.ease),
        },
        () => {
          // 动画完成后更新步骤
          runOnJS(setCurrentStep)(nextIndex);
          // 淡入动画
          fadeOpacity.value = withTiming(1, {
            duration: 300,
            easing: Easing.in(Easing.ease),
          });
        },
      );

      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      // 完成引导，进入主应用
      appStore.completeOnboarding();
    }
  };

 

 
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleScroll = (event) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentStep) {
      // 触发文字动画
      textOpacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setCurrentStep)(index);
        currentStepValue.value = index;
        textOpacity.value = withTiming(1, { duration: 300 });
        textTranslateY.value = withTiming(0, { duration: 300 });
      });
      textTranslateY.value = withTiming(20, { duration: 200 });
    }
  };

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

  const renderMiddleText = () => {
    const currentStepData = onboardingSteps[currentStep];
    console.log('currentStep->', currentStep);

    // 使用 withTiming 的动画样式
    const fadeStyle = useAnimatedStyle(() => {
      return {
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }],
      };
    });

    return (
      <Animated.View style={[styles.middleSection, fadeStyle]}>
        <Text style={styles.title}>{currentStepData.title}</Text>
        <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
      </Animated.View>
    );
  };

  const renderBottomButton = () => {
    const currentStepData = onboardingSteps[currentStep];

    const buttonFadeStyle = useAnimatedStyle(() => {
      return {
        opacity: fadeOpacity.value,
      };
    });

    return (
      <Animated.View style={[styles.bottomSection, buttonFadeStyle]}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>
            {currentStepData.buttonText}
          </Text>
        </TouchableOpacity>
      </Animated.View>
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
      <View style={styles.indicators}>
        {onboardingSteps.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const input = scrollX.value;
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const scale = interpolate(
              input,
              inputRange,
              [0.8, 1.2, 0.8],
              'clamp',
            );

            const opacity = interpolate(
              input,
              inputRange,
              [0.4, 1, 0.4],
              'clamp',
            );

            return {
              transform: [{scale}],
              opacity,
            };
          });

          return (
            <Animated.View
              key={index}
              style={[styles.indicator, animatedStyle]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <BasePage 
      barStyle={StatusBarStyles.DARK_CONTENT}
      style={styles.container}
    >
      {/* 顶部内容区域 - 正常切换 */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}>
        {onboardingSteps.map((_, index) => renderStep(index))}
      </ScrollView>

      {/* 中间文字区域 - 淡入淡出动画
      {renderMiddleText()} */}
       {renderMiddleText()}

      {/* 底部按钮区域 - 只修改文本 */}
      {renderBottomButton()}

      {/* 动画指示器 */}
      {renderAnimatedIndicators()}
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

  // 中间文字区域
  middleSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },

  // 底部按钮区域
  bottomSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
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

  // 文字样式
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.neutral.black,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.neutral.darkGray,
    textAlign: 'center',
    lineHeight: 24,
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
  skipButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  skipButtonText: {
    color: theme.colors.neutral.gray,
    fontSize: 14,
  },

  // 指示器样式
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacing.lg,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.neutral.lightGray,
    marginHorizontal: 4,
  },
});

export default OnboardingScreen;
