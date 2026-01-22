import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../theme';
import { ShoppingTrip } from '../types';
import { formatPeso, formatDate } from '../utils/formatCurrency';

interface TripDetailScreenProps {
  trip: ShoppingTrip;
  onClose: () => void;
}

/**
 * Trip detail screen showing all items from a past shopping trip
 * Features receipt-style layout with items list and total
 */
export function TripDetailScreen({ trip, onClose }: TripDetailScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{formatDate(trip.date)}</Text>

        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Items List */}
        <View style={styles.receiptCard}>
          <Text style={styles.sectionTitle}>Items Purchased</Text>

          {trip.items.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInRight.delay(index * 30).duration(200)}
              layout={Layout.springify()}
            >
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name || 'Unnamed item'}
                  </Text>
                  {item.barcode && (
                    <Text style={styles.itemBarcode}>Scanned item</Text>
                  )}
                </View>
                <Text style={styles.itemPrice}>{formatPeso(item.price)}</Text>
              </View>

              {index < trip.items.length - 1 && <View style={styles.itemDivider} />}
            </Animated.View>
          ))}

          {/* Dashed Separator */}
          <View style={styles.dashedLine} />

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryValue}>{trip.items.length}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>{formatPeso(trip.total)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header styles
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.primary,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    minWidth: 80,
  },
  backIcon: {
    fontSize: 16,
    color: colors.textInverse,
    marginRight: spacing.xs,
  },
  backLabel: {
    ...typography.label.medium,
    color: colors.textInverse,
  },
  title: {
    ...typography.display.medium,
    color: colors.textInverse,
  },
  spacer: {
    minWidth: 80,
  },

  // Content styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  // Receipt card styles
  receiptCard: {
    backgroundColor: colors.receiptBg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  sectionTitle: {
    ...typography.label.small,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },

  // Item row styles
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemName: {
    ...typography.body.large,
    color: colors.text,
  },
  itemBarcode: {
    ...typography.body.tiny,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  itemPrice: {
    ...typography.price.small,
    color: colors.text,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },

  // Dashed line
  dashedLine: {
    height: 1,
    marginVertical: spacing.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.receiptDash,
  },

  // Summary styles
  summary: {
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.body.medium,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body.medium,
    fontFamily: 'DMSans-Medium',
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  totalLabel: {
    ...typography.label.large,
    color: colors.text,
  },
  totalValue: {
    ...typography.price.large,
    color: colors.primary,
  },
});
