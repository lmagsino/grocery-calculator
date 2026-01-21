import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../theme';

interface ActionButtonsProps {
  onAddItem: () => void;
  onScan: () => void;
  onDone: () => void;
  hasItems: boolean;
}

/**
 * Bottom action bar with Add Item, Scan, and Done buttons
 * Uses coral accent for primary actions
 */
export function ActionButtons({ onAddItem, onScan, onDone, hasItems }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      {/* Top row: Add Item and Scan buttons */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onAddItem}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonIcon}>+</Text>
          <Text style={styles.secondaryButtonText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onScan}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonIcon}>📷</Text>
          <Text style={styles.secondaryButtonText}>Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom row: Done button */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          !hasItems && styles.primaryButtonDisabled,
        ]}
        onPress={onDone}
        activeOpacity={0.8}
        disabled={!hasItems}
      >
        <Text style={styles.primaryButtonIcon}>✓</Text>
        <Text style={styles.primaryButtonText}>Done - Save Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
    gap: spacing.md,
  },

  // Top row with secondary buttons
  topRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  // Secondary buttons (Add Item, Scan)
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.sm,
  },
  secondaryButtonIcon: {
    fontSize: 18,
    color: colors.primary,
  },
  secondaryButtonText: {
    ...typography.label.large,
    color: colors.text,
  },

  // Primary button (Done)
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    ...shadows.accent,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
  },
  primaryButtonIcon: {
    fontSize: 18,
    color: colors.textInverse,
  },
  primaryButtonText: {
    ...typography.label.large,
    color: colors.textInverse,
    fontSize: 16,
  },
});
