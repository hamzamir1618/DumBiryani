import { useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { dishes } from '@/data/menu';
import { Space } from '@/theme';

export default function DishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dish = dishes.find((d) => d.id === id);

  if (!dish) {
    return (
      <Screen>
        <Text variant="title">Not found</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text variant="title">{dish.name}</Text>
      <Text color="textMuted" style={{ marginTop: Space.md }}>
        {dish.description}
      </Text>
    </Screen>
  );
}
