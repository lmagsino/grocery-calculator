import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, layout, shadows } from '../theme';

interface HeaderProps {
  onHistoryPress?: () => void;
}

/**
 * App header with sage green background and Fraunces display font
 * Features a history button for navigation to past trips
 */
export function Header({ onHistoryPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.historyButton}
        onPress={onHistoryPress}
        activeOpacity={0.7}
        accessibilityLabel="View shopping history"
        accessibilityRole="button"
      >
        <Text style={styles.historyIcon}>📋</Text>
        <Text style={styles.historyLabel}>History</Text>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.cartIcon}>🛒</Text>
        <Text style={styles.title}>GroceryCalc</Text>
      </View>

      {/* Spacer for balance */}
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.primary,
  },

  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    minWidth: 80,
  },
  historyIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  historyLabel: {
    ...typography.label.medium,
    color: colors.textInverse,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  cartIcon: {
    fontSize: 22,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.display.medium,
    color: colors.textInverse,
  },

  spacer: {
    minWidth: 80,
  },
});
