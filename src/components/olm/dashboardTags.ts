export const DASHBOARD_TAGS = {
  dashboard: "dshb",
  group: "dshbGroup",
  efficiency: "dshbEfficiency",
  effort: "dshbEffort",
} as const;

type DashboardGroupLike = {
  id?: string | null;
  tags?: readonly string[] | null;
};

type DashboardUserLike = {
  tags?: readonly string[] | null;
  groups?: readonly DashboardGroupLike[] | null;
};

export function getSelectedDashboardGroup(
  user?: DashboardUserLike | null,
  selectedGroup?: DashboardGroupLike | null,
) {
  const groups = user?.groups ?? [];
  const selectedGroupId = selectedGroup?.id;

  if (selectedGroupId) {
    const matchingGroup = groups.find(group => group?.id === selectedGroupId);
    if (matchingGroup) return matchingGroup;
  }

  if (groups.length > 0) return groups[0] ?? null;

  return user ? null : (selectedGroup ?? null);
}

export function getDashboardPermissions(
  user?: DashboardUserLike | null,
  selectedGroup?: DashboardGroupLike | null,
) {
  const group = getSelectedDashboardGroup(user, selectedGroup);
  const tags = new Set([...(user?.tags ?? []), ...(group?.tags ?? [])]);
  const canViewDashboard = tags.has(DASHBOARD_TAGS.dashboard);

  return {
    group,
    canViewDashboard,
    showGroupProgress: canViewDashboard && tags.has(DASHBOARD_TAGS.group),
    showEfficiency: canViewDashboard && tags.has(DASHBOARD_TAGS.efficiency),
    showEffort: canViewDashboard && tags.has(DASHBOARD_TAGS.effort),
  };
}
