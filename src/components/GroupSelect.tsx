import { NativeSelect } from "@chakra-ui/react";
import { useAuth } from "./Auth";
import { proxy } from "valtio";
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

  let gs: boolean = true;
  if (isLoading || !user || user.groups.length == 0) gs = false;
  useEffect(() => {
    if (gs) gSelect.group = user.groups[0] as group;
    else gSelect.group = null;
  }, [user]);

return gs ? (
  <NativeSelect.Root size="sm" width="full">
    <NativeSelect.Field
      value={user.groups.findIndex(g => g.id === gSelect.group?.id) ?? ""}
      onChange={(e) => {
        const idx = Number(e.currentTarget.value);
        const selectedGroup = user.groups[idx];
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
