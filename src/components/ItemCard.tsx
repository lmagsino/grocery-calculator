import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Layout,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GroceryItem } from '../types';
import { formatPeso } from '../utils/formatCurrency';

interface ItemCardProps {
  item: GroceryItem;
  onPress?: () => void;
  onDelete?: () => void;
}

/**
 * Receipt-style item card with distinctive typography
 * Features smooth enter/exit animations and press feedback
 */
export function ItemCard({ item, onPress, onDelete }: ItemCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const displayName = item.name || 'Unnamed item';
  const isUnnamed = !item.name || item.name === 'Item';

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      entering={FadeInRight.duration(300).springify()}
      exiting={FadeOutLeft.duration(200)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.leftSection}>
          <Text style={[styles.name, isUnnamed && styles.nameUnnamed]} numberOfLines={1}>
            {displayName}
          </Text>
          {item.barcode && (
            <Text style={styles.barcode}>Scanned item</Text>
          )}
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.price}>{formatPeso(item.price)}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },

  leftSection: {
    flex: 1,
    marginRight: spacing.md,
  },
  name: {
    ...typography.body.large,
    fontFamily: 'DMSans-Medium',
    color: colors.text,
  },
  nameUnnamed: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  barcode: {
    ...typography.body.tiny,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    ...typography.price.medium,
    color: colors.text,
  },

  deleteButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
  },
  deleteIcon: {
    fontSize: 16,
    color: colors.textMuted,
  },
});
