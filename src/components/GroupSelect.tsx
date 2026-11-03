import { NativeSelect } from "@chakra-ui/react";
import { useAuth } from "./Auth";
import { proxy } from "valtio";
import { useSnapshot } from "valtio";
import { useEffect } from "react";

interface group {
  id: string;
  code: string;
  label: string;
  tags: Array<string>;
}

export const gSelect = proxy<{
  group?: group;
  hasGroup: boolean;
  onChange: boolean;
}>({
  group: null,
  hasGroup: false,
  onChange: false,
});

export const GroupSelect = () => {
  const { isLoading, user } = useAuth();
  const groupSelection = useSnapshot(gSelect);

  let gs: boolean = true;
  if (isLoading || !user || user.groups.length == 0) gs = false;

  useEffect(() => {
    if (!gs) {
      gSelect.group = null;
      return;
    }

    const currentGroupId = gSelect.group?.id;
    const matchingGroup = user.groups.find(g => g.id === currentGroupId);

    if (matchingGroup) {
      gSelect.group = {
        ...matchingGroup,
        tags: [...matchingGroup.tags],
      };
      return;
    }

    gSelect.group = {
      ...(user.groups[0] as group),
      tags: [...user.groups[0].tags],
    };
  }, [gs, user]);

  const selectedIndex = user?.groups.findIndex(g => g.id === groupSelection.group?.id) ?? -1;

  return gs ? (
    <NativeSelect.Root size="sm" width="full">
      <NativeSelect.Field
        value={selectedIndex >= 0 ? String(selectedIndex) : ""}
        onChange={e => {
          const idx = Number(e.currentTarget.value);
          const selectedGroup = user.groups[idx];

          if (!selectedGroup) return;

          gSelect.group = {
            ...selectedGroup,
            tags: [...selectedGroup.tags],
          };
          gSelect.onChange = true;
        }}
      >
        {user.groups.map((g, i) => (
          <option key={i} value={i}>
            Grupo: {g.label}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  ) : null;
};
