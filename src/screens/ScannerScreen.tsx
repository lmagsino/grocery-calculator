import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../theme';
import { lookupBarcode } from '../services/openFoodFacts';

interface ScannerScreenProps {
  onClose: () => void;
  onProductScanned: (name: string, barcode: string) => void;
  onManualEntry: () => void;
}

/**
 * Barcode scanner screen with camera viewfinder
 * Looks up products via Open Food Facts API
 */
export function ScannerScreen({ onClose, onProductScanned, onManualEntry }: ScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Request permission on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (!isScanning || isLookingUp) return;

    setIsScanning(false);
    setIsLookingUp(true);

    const barcode = result.data;
    console.log('Scanned barcode:', barcode);

    try {
      const productName = await lookupBarcode(barcode);

      if (productName) {
        onProductScanned(productName, barcode);
      } else {
        Alert.alert(
          'Product Not Found',
          'This product was not found in the database. Would you like to enter it manually?',
          [
            {
              text: 'Try Again',
              onPress: () => {
                setIsScanning(true);
                setIsLookingUp(false);
              },
            },
            {
              text: 'Enter Manually',
              onPress: onManualEntry,
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Lookup Failed',
        'Could not look up product. Please try again or enter manually.',
        [
          {
            text: 'Try Again',
            onPress: () => {
              setIsScanning(true);
              setIsLookingUp(false);
            },
          },
          {
            text: 'Enter Manually',
            onPress: onManualEntry,
          },
        ]
      );
    }
  };

  // Permission not yet determined
  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close scanner"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Barcode</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.centered}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan barcodes.{'\n'}
            Please enable it in your device settings.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
            accessibilityLabel="Grant camera permission"
            accessibilityRole="button"
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.manualButton}
            onPress={onManualEntry}
            accessibilityLabel="Enter item manually"
            accessibilityRole="button"
          >
            <Text style={styles.manualButtonText}>Enter Manually Instead</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          accessibilityLabel="Close scanner"
          accessibilityRole="button"
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Barcode</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: [
              'ean13',
              'ean8',
              'upc_a',
              'upc_e',
              'code128',
              'code39',
              'code93',
            ],
          }}
          onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
        >
          {/* Viewfinder Overlay */}
          <View style={styles.overlay}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              <View style={styles.viewfinder}>
                {/* Corner markers */}
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />

                {/* Scanning indicator */}
                {isLookingUp && (
                  <View style={styles.lookupIndicator}>
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text style={styles.lookupText}>Looking up product...</Text>
                  </View>
                )}
              </View>
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom} />
          </View>
        </CameraView>
      </View>

      {/* Instructions */}
      <View style={styles.footer}>
        <Text style={styles.instruction}>
          Point camera at a product barcode
        </Text>
        <TouchableOpacity
          style={styles.manualButton}
          onPress={onManualEntry}
          accessibilityLabel="Enter item manually"
          accessibilityRole="button"
        >
          <Text style={styles.manualButtonText}>Enter Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const VIEWFINDER_SIZE = 280;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.text,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textInverse,
    fontWeight: '300',
  },
  headerTitle: {
    ...typography.display.small,
    color: colors.textInverse,
  },
  placeholder: {
    width: 44,
  },

  // Camera
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },

  // Overlay
  overlay: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  // Viewfinder
  viewfinder: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Corner markers
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: colors.accent,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 4,
  },

  // Lookup indicator
  lookupIndicator: {
    alignItems: 'center',
    gap: spacing.md,
  },
  lookupText: {
    ...typography.body.medium,
    color: colors.textInverse,
  },

  // Footer
  footer: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    gap: spacing.lg,
  },
  instruction: {
    ...typography.body.large,
    color: colors.textInverse,
    textAlign: 'center',
  },

  // Permission screen
  permissionTitle: {
    ...typography.display.small,
    color: colors.textInverse,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    ...typography.body.medium,
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: spacing.xl,
  },
  permissionButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
    ...shadows.accent,
  },
  permissionButtonText: {
    ...typography.label.large,
    color: colors.textInverse,
  },

  // Manual entry button
  manualButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  manualButtonText: {
    ...typography.label.large,
    color: colors.textInverse,
    opacity: 0.8,
  },
});
