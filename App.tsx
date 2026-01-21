import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from './src/hooks/useFonts';
import { GroceryProvider, useGrocery } from './src/context/GroceryContext';
import {
  Header,
  ItemCard,
  EmptyState,
  TotalDisplay,
  ActionButtons,
  AddItemModal,
} from './src/components';
import { colors, spacing, layout } from './src/theme';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

function HomeScreen() {
  const {
    currentItems,
    itemCount,
    total,
    openAddModal,
    deleteItem,
    openEditModal,
    saveTrip,
  } = useGrocery();

  const handleScan = () => {
    // TODO: Implement in Phase 6
    Alert.alert('Coming Soon', 'Barcode scanning will be available soon!');
  };

  const handleDone = () => {
    Alert.alert(
      'Save Trip',
      `Save this shopping trip with ${itemCount} items totaling ₱${total.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: saveTrip },
      ]
    );
  };

  const handleHistory = () => {
    // TODO: Implement in Phase 8
    Alert.alert('Coming Soon', 'Shopping history will be available soon!');
  };

  return (
    <View style={styles.screen}>
      <Header onHistoryPress={handleHistory} />

      {/* Content Area */}
      <View style={styles.content}>
        {currentItems.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {currentItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onDelete={() => deleteItem(item.id)}
                onPress={() => openEditModal(item)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Total Display */}
      <TotalDisplay itemCount={itemCount} total={total} />

      {/* Action Buttons */}
      <ActionButtons
        onAddItem={openAddModal}
        onScan={handleScan}
        onDone={handleDone}
        hasItems={currentItems.length > 0}
      />

      {/* Add/Edit Modal */}
      <AddItemModal />
    </View>
  );
}

export default function App() {
  const { fontsLoaded, fontError } = useFonts();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show loading state while fonts load
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GroceryProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']} onLayout={onLayoutRootView}>
          <StatusBar style="light" />
          <HomeScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    </GroceryProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
});
