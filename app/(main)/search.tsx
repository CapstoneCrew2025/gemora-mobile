import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function Search() {
  const { theme } = useTheme();

  const styles = getStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
}

const getStyles = (colors: { background: string; text: string; subtext: string }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.subtext,
    },
  });