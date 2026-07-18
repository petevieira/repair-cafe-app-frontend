import { useState, useCallback } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { Text, Card, SegmentedButtons, Divider } from "react-native-paper";
import { Dropdown as ElementDropdown } from "react-native-element-dropdown";
import { BarChart, PieChart } from "react-native-gifted-charts";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";

import styles from "globals/Styles";
import appColors from "globals/colors";
import { useAuth } from "contexts/auth-context";
import { getRepairStats } from "requests/stats-requests";
import { Response, StatsData } from "types/Response";
import { RepairStats, StatsBucket, OutcomeScope } from "types/Stats";
import { WEIGHT_UNITS, COST_UNITS } from "@env";

const weightUnit = WEIGHT_UNITS || "lbs";
const costUnit = COST_UNITS || "$";

const OUTCOME_COLORS = {
  fixed: "#2e8b57",
  repairable: "#2f6f9f",
  endOfLife: "#c34a51",
  unknown: "#9e9e9e",
  inQueue: "#e0a458",
  inProgress: "#8d6cab",
};

type YearOption = { label: string; value: string };

/**
 * Format a number with thousands separators and up to `decimals` decimals.
 */
const formatNumber = (value: number, decimals: number = 0): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * The stored product category ("type") includes a parenthetical description,
 * e.g. "Laptop (Portable computer)". Show just the leading name.
 */
const shortenCategory = (category: string): string => {
  if (!category) {
    return "Unknown";
  }
  return category.split(" (")[0];
};

/**
 * Resolved items are those with a final outcome (excludes In Queue / In Progress).
 */
const resolvedCount = (bucket: StatsBucket): number =>
  bucket.counts.fixed + bucket.counts.repairable + bucket.counts.endOfLife + bucket.counts.unknown;

/**
 * Numerator for the repair rate given the selected outcome scope.
 */
const scopedResolvedCount = (bucket: StatsBucket, scope: OutcomeScope): number =>
  scope === "fixed" ? bucket.counts.fixed : bucket.counts.fixed + bucket.counts.repairable;

/**
 * Convert a 6-digit hex color to an rgba() string at the given alpha, used to
 * make a soft tinted circle behind each stat icon.
 */
const withAlpha = (hex: string, alpha: number): string => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type StatCardProps = {
  label: string;
  value: string;
  sublabel?: string;
  icon?: string;
  iconColor?: string;
};

const StatCard = ({ label, value, sublabel, icon, iconColor }: StatCardProps) => {
  const accent = iconColor || appColors.primary;
  return (
    <Card style={{ flexGrow: 1, flexBasis: "45%", margin: 5, backgroundColor: "white" }}>
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon ? (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: withAlpha(accent, 0.14),
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <FontAwesome5 name={icon} size={18} color={accent} solid />
            </View>
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: "#717171" }}>{label}</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: appColors.textPrimary, marginTop: 2 }}>
              {value}
            </Text>
            {sublabel ? <Text style={{ fontSize: 12, color: "#9e9e9e", marginTop: 2 }}>{sublabel}</Text> : null}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

/**
 * Dashboard component
 * Displays aggregate repair stats (all-time and per-year) with charts.
 */
const Dashboard = () => {
  const { setShowLoader, setSnackbarMsg } = useAuth();
  const [stats, setStats] = useState<RepairStats | null>(null);
  const [retrieved, setRetrieved] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [scope, setScope] = useState<OutcomeScope>("fixed");

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = Math.min(screenWidth - 60, 640);

  const getStats = async (): Promise<void> => {
    try {
      setShowLoader(true);
      const res: Response<StatsData> = await getRepairStats();
      setStats(res.data.stats);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.message);
    } finally {
      setShowLoader(false);
      setRetrieved(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStats();
    }, [])
  );

  if (!stats) {
    return (
      <ScrollView contentContainerStyle={styles.topScrollView} style={{ backgroundColor: appColors.bgGray }}>
        <View style={styles.content}>
          {retrieved && (
            <Text style={{ padding: 10, alignSelf: "center" }}>{"No stats available yet"}</Text>
          )}
        </View>
      </ScrollView>
    );
  }

  const yearOptions: YearOption[] = [
    { label: "All-time", value: "all" },
    ...[...stats.byYear]
      .filter((y) => y.year !== null)
      .sort((a, b) => (b.year as number) - (a.year as number))
      .map((y) => ({ label: String(y.year), value: String(y.year) })),
  ];

  const currentBucket: StatsBucket =
    selectedYear === "all"
      ? stats.allTime
      : stats.byYear.find((y) => String(y.year) === selectedYear) ?? stats.allTime;

  const resolved = resolvedCount(currentBucket);
  const scopedResolved = scopedResolvedCount(currentBucket, scope);
  const repairRate = resolved > 0 ? (scopedResolved / resolved) * 100 : 0;

  const moneySaved = currentBucket.moneySaved[scope];
  const weightDiverted = currentBucket.weightDiverted[scope];

  const scopeLabel = scope === "fixed" ? "Fixed" : "Fixed + Repairable";

  // Per-year intake trend
  const perYearData = [...stats.byYear]
    .filter((y) => y.year !== null)
    .sort((a, b) => (a.year as number) - (b.year as number))
    .map((y) => ({
      value: y.totalIntake,
      label: String(y.year),
      frontColor: "#4c9f70",
    }));

  // Outcome breakdown for the current bucket
  const outcomeEntries = [
    { key: "fixed", label: "Fixed", value: currentBucket.counts.fixed, color: OUTCOME_COLORS.fixed },
    { key: "repairable", label: "Repairable", value: currentBucket.counts.repairable, color: OUTCOME_COLORS.repairable },
    { key: "endOfLife", label: "End of Life", value: currentBucket.counts.endOfLife, color: OUTCOME_COLORS.endOfLife },
    { key: "unknown", label: "Unknown", value: currentBucket.counts.unknown, color: OUTCOME_COLORS.unknown },
    { key: "inQueue", label: "In Queue", value: currentBucket.counts.inQueue, color: OUTCOME_COLORS.inQueue },
    { key: "inProgress", label: "In Progress", value: currentBucket.counts.inProgress, color: OUTCOME_COLORS.inProgress },
  ].filter((e) => e.value > 0);

  const pieData = outcomeEntries.map((e) => ({ value: e.value, color: e.color }));

  // Top categories
  const maxCategoryCount = currentBucket.topCategories.reduce((max, c) => Math.max(max, c.count), 0);

  return (
    <ScrollView contentContainerStyle={styles.topScrollView} style={{ backgroundColor: appColors.bgGray }}>
      <View style={styles.content}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12, color: appColors.textPrimary }}>
          Impact Dashboard
        </Text>

        {/* Year selector */}
        <View style={styles.dropdownContainer}>
          <View style={[styles.label]}>
            <Text style={{ color: "#717171" }}>Time period</Text>
          </View>
          <ElementDropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            iconStyle={styles.iconStyle as any}
            data={yearOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select time period"
            value={selectedYear}
            onChange={(item) => setSelectedYear(item.value)}
          />
        </View>

        {/* Outcome scope toggle */}
        <View style={{ marginTop: 16, marginBottom: 8 }}>
          <SegmentedButtons
            value={scope}
            onValueChange={(v) => setScope(v as OutcomeScope)}
            buttons={[
              { value: "fixed", label: "Fixed" },
              { value: "fixedPlusRepairable", label: "Fixed + Repairable" },
            ]}
          />
        </View>

        {/* KPI cards */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
          <StatCard
            label="Money saved"
            value={`${formatNumber(moneySaved)} ${costUnit}`}
            sublabel={`Replacement cost of ${scopeLabel.toLowerCase()} items`}
            icon="hand-holding-usd"
            iconColor="#2e8b57"
          />
          <StatCard
            label="Weight kept from landfill"
            value={`${formatNumber(weightDiverted, 1)} ${weightUnit}`}
            sublabel={`${scopeLabel} items`}
            icon="balance-scale"
            iconColor="#2f6f9f"
          />
          <StatCard
            label="Repair rate"
            value={`${formatNumber(repairRate, 1)}%`}
            sublabel={`${scopedResolved} of ${resolved} resolved`}
            icon="percent"
            iconColor="#8d6cab"
          />
          <StatCard
            label="Items helped"
            value={formatNumber(scopedResolved)}
            sublabel={`${formatNumber(currentBucket.totalIntake)} total intake`}
            icon="tools"
            iconColor="#4c9f70"
          />
        </View>

        {/* Events & volunteers (independent of the Fixed/Repairable toggle) */}
        <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 4 }}>
          Events & volunteers
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <StatCard
            label="Volunteers"
            value={formatNumber(currentBucket.volunteers)}
            sublabel={`across ${formatNumber(currentBucket.events)} event${currentBucket.events === 1 ? "" : "s"}`}
            icon="users"
            iconColor="#2f6f9f"
          />
          <StatCard
            label="Avg volunteers / event"
            value={formatNumber(currentBucket.avgVolunteersPerEvent, 1)}
            icon="user-friends"
            iconColor="#8d6cab"
          />
          <StatCard
            label="Most items at an event"
            value={formatNumber(currentBucket.maxItemsAtEvent)}
            icon="trophy"
            iconColor="#e0a458"
          />
          <StatCard
            label="Avg items / event"
            value={formatNumber(currentBucket.avgItemsPerEvent, 1)}
            icon="boxes"
            iconColor="#4c9f70"
          />
        </View>

        {/* Per-year intake trend */}
        {perYearData.length > 0 && (
          <Card style={{ marginTop: 16, backgroundColor: "white" }}>
            <Card.Content>
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>Items brought in by year</Text>
              <BarChart
                data={perYearData}
                width={chartWidth}
                height={200}
                barWidth={32}
                initialSpacing={16}
                spacing={24}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                xAxisLabelTextStyle={{ color: "#717171", fontSize: 11 }}
                yAxisTextStyle={{ color: "#717171", fontSize: 11 }}
                isAnimated
              />
            </Card.Content>
          </Card>
        )}

        {/* Outcome breakdown */}
        {outcomeEntries.length > 0 && (
          <Card style={{ marginTop: 16, backgroundColor: "white" }}>
            <Card.Content>
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>
                Outcome breakdown ({selectedYear === "all" ? "all-time" : selectedYear})
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                <View style={{ padding: 8 }}>
                  <PieChart
                    data={pieData}
                    donut
                    radius={90}
                    innerRadius={55}
                    innerCircleColor={"white"}
                  />
                </View>
                <View style={{ flex: 1, minWidth: 160, paddingLeft: 8 }}>
                  {outcomeEntries.map((e) => (
                    <View key={e.key} style={{ flexDirection: "row", alignItems: "center", marginVertical: 3 }}>
                      <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: e.color, marginRight: 8 }} />
                      <Text style={{ fontSize: 13, color: appColors.textPrimary }}>
                        {e.label}: {formatNumber(e.value)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Top categories */}
        {currentBucket.topCategories.length > 0 && (
          <Card style={{ marginTop: 16, marginBottom: 24, backgroundColor: "white" }}>
            <Card.Content>
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>Most repaired items</Text>
              {currentBucket.topCategories.map((cat, idx) => (
                <View key={`${cat.category}-${idx}`} style={{ marginVertical: 5 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                    <Text style={{ fontSize: 13, color: appColors.textPrimary, flex: 1 }} numberOfLines={1}>
                      {idx + 1}. {shortenCategory(cat.category)}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#717171", marginLeft: 8 }}>{formatNumber(cat.count)}</Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: "#eee", borderRadius: 4, overflow: "hidden" }}>
                    <View
                      style={{
                        height: 8,
                        width: `${maxCategoryCount > 0 ? (cat.count / maxCategoryCount) * 100 : 0}%`,
                        backgroundColor: "#4c9f70",
                        borderRadius: 4,
                      }}
                    />
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {currentBucket.totalIntake === 0 && (
          <Text style={{ padding: 10, alignSelf: "center", color: "#717171" }}>
            {"No repairs recorded for this period"}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Dashboard;
