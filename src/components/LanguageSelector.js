import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, getAvailableLanguages } from '../utils/languageUtils';
import theme from '../styles/theme';

const LanguageSelector = () => {
  const { t } = useTranslation();
  const currentLanguage = getCurrentLanguage();
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
  };

  return (
    <View style={styles.container}>
      {availableLanguages.map((language) => (
        <TouchableOpacity
          key={language.code}
          style={[
            styles.languageButton,
            currentLanguage === language.code && styles.activeLanguageButton,
          ]}
          onPress={() => handleLanguageChange(language.code)}
        >
          <Text
            style={[
              styles.languageText,
              currentLanguage === language.code && styles.activeLanguageText,
            ]}
          >
            {language.nativeName}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  languageButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.neutral.lightGray,
    backgroundColor: 'transparent',
  },
  activeLanguageButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  languageText: {
    fontSize: 14,
    color: theme.colors.neutral.darkGray,
    fontWeight: '500',
  },
  activeLanguageText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LanguageSelector; 