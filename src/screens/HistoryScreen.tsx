import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../theme';
import { ShoppingTrip } from '../types';
import { formatPeso, formatDate } from '../utils/formatCurrency';

interface HistoryScreenProps {
  trips: ShoppingTrip[];
  onClose: () => void;
  onTripPress: (trip: ShoppingTrip) => void;
}

/**
 * Shopping history screen showing past trips
 * Features receipt-style cards with trip summaries
 */
export function HistoryScreen({ trips, onClose, onTripPress }: HistoryScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onClose}
          activeOpacity={0.7}
          accessibilityLabel="Go back to shopping list"
          accessibilityRole="button"
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>History</Text>

        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
            </View>
            <Text style={styles.emptyTitle}>No shopping trips yet</Text>
            <Text style={styles.emptySubtitle}>
              Complete a shopping trip to see it here
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Past Shopping Trips</Text>

            {trips.map((trip, index) => (
              <Animated.View
                key={trip.id}
                entering={FadeInRight.delay(index * 50).duration(300)}
                layout={Layout.springify()}
              >
                <TouchableOpacity
                  style={styles.tripCard}
                  onPress={() => onTripPress(trip)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripDate}>{formatDate(trip.date)}</Text>
                    <Text style={styles.tripItems}>
                      {trip.items.length} {trip.items.length === 1 ? 'item' : 'items'}
                    </Text>
                  </View>

                  <View style={styles.tripRight}>
                    <Text style={styles.tripTotal}>{formatPeso(trip.total)}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        )}
      </View>
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
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.label.small,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },

  // Trip card styles
  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  tripInfo: {
    flex: 1,
  },
  tripDate: {
    ...typography.body.large,
    fontFamily: 'DMSans-SemiBold',
    color: colors.text,
  },
  tripItems: {
    ...typography.body.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  tripRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripTotal: {
    ...typography.price.medium,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
  },

  // Empty state styles
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    ...typography.display.small,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body.medium,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
