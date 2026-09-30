import { Search, X } from 'lucide-react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
}: SearchBarProps) {
  const { top, left, right } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top + spacing.md,
          paddingLeft: spacing.lg + left,
          paddingRight: spacing.lg + right,
        },
      ]}
    >
      <View style={styles.field}>
        <Search color={colors.textPrimary} size={18} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder="TV shows, movies and more"
          placeholderTextColor={colors.placeholder}
          returnKeyType="go"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
          accessibilityLabel="Search movies"
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={value ? 'Clear search' : 'Close search'}
          onPress={onClear}
          hitSlop={spacing.md}
        >
          <X color={colors.textPrimary} size={20} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  field: {
    height: 52,
    borderRadius: 30,
    backgroundColor: colors.searchField,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
});
