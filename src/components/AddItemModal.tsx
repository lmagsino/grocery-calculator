import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../theme';
import { useGrocery } from '../context/GroceryContext';
import { parsePeso } from '../utils/formatCurrency';

/**
 * Modal for adding or editing grocery items
 * Features peso-formatted price input and form validation
 */
export function AddItemModal() {
  const { isAddModalVisible, editingItem, closeModal, addItem, updateItem } = useGrocery();

  const [name, setName] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [error, setError] = useState('');

  const isEditing = editingItem !== null;

  // Populate form when editing
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name === 'Item' ? '' : editingItem.name);
      setPriceInput(editingItem.price.toString());
    } else {
      setName('');
      setPriceInput('');
    }
    setError('');
  }, [editingItem, isAddModalVisible]);

  const handlePriceChange = (text: string) => {
    // Only allow numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    setPriceInput(cleaned);
    setError('');
  };

  const handleSubmit = () => {
    const price = parsePeso(priceInput);

    if (price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (isEditing && editingItem) {
      updateItem(editingItem.id, name, price);
    } else {
      addItem(name, price);
    }
  };

  const handleClose = () => {
    setName('');
    setPriceInput('');
    setError('');
    closeModal();
  };

  return (
    <Modal
      visible={isAddModalVisible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>
                  {isEditing ? 'Edit Item' : 'Add Item'}
                </Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Item Name Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Item Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Milk, Bread, Eggs"
                    placeholderTextColor={colors.textMuted}
                    returnKeyType="next"
                    autoCapitalize="words"
                  />
                  <Text style={styles.hint}>Optional</Text>
                </View>

                {/* Price Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Price</Text>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.pesoSign}>₱</Text>
                    <TextInput
                      style={styles.priceInput}
                      value={priceInput}
                      onChangeText={handlePriceChange}
                      placeholder="0.00"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                  </View>
                  {error ? (
                    <Text style={styles.error}>{error}</Text>
                  ) : (
                    <Text style={styles.hint}>Required</Text>
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !priceInput && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!priceInput}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitButtonText}>
                    {isEditing ? 'Save Changes' : 'Add Item'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
    paddingHorizontal: layout.screenPadding,
    ...shadows.xl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    position: 'relative',
  },
  title: {
    ...typography.display.small,
    color: colors.text,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: spacing.sm,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '300',
  },

  // Form
  form: {
    gap: spacing.xl,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label.large,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  hint: {
    ...typography.body.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.body.small,
    color: colors.error,
    marginTop: spacing.xs,
  },

  // Text Input
  textInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 17,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Price Input
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  pesoSign: {
    ...typography.price.medium,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  priceInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 24,
    fontFamily: 'Fraunces',
    color: colors.text,
  },

  // Submit Button
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadows.accent,
  },
  submitButtonDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
  },
  submitButtonText: {
    ...typography.label.large,
    color: colors.textInverse,
    fontSize: 17,
  },
});
