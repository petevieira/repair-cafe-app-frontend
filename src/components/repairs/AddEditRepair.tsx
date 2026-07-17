import { useState, useEffect, useRef } from "react";
import { View, Platform, KeyboardAvoidingView, ScrollView, Dimensions, ImageStyle, Pressable } from "react-native";
import { Button, Dialog, Divider, Portal, TextInput, HelperText, Text } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
const PaperDropDown = DropDown;
import { Dropdown as ElementDropdown } from "react-native-element-dropdown";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import SubmitButton from "globals/SubmitButton";
import styles from "globals/Styles";
import Repair from "models/Repair";
import Volunteer from "models/Volunteer";
import CheckBox from "globals/CheckBox";
import { useAuth } from "contexts/auth-context";
import { getVolunteersByEvent } from "requests/volunteer-requests";
import {
  addFullRepair,
  getRepair,
  updateRepair,
  deleteRepair,
  findOwnerByEmail,
  findIncompleteRepairsByOwner,
  getRepairsByEvent,
} from "requests/repair-requests";
import {
  subscribeEmailToNewsletter,
  unsubscribeEmailFromNewsletter,
  getIsSubscribed,
} from "requests/subscriber-requests";
import {
  buildProductCategoryDropdownList,
  ProductCategoryDropdownItem,
  RepairStatusValues,
  RepairBarrierValues,
} from "globals/ords";
import Terms from "globals/Terms";
import { WEIGHT_UNITS, COST_UNITS } from "@env";
import { emailIsValid, eventInThePast, eventInTheFuture } from "lib/helpers";
import { Response, RepairData, RepairsData, OwnerData, VolunteersData, SubscribedData } from "types/Response";

const { selectableItems: ordsProductCategoryList, dropdownData: ordsProductCategoryDropdownData } =
  buildProductCategoryDropdownList();

const UNSELECTED_PRODUCT_CATEGORY_IDX = -1;
const PRODUCT_CATEGORY_PLACEHOLDER = "Please Select the Closest Option";

const ordsRepairStatusList = RepairStatusValues.map((el, idx) => {
  return { label: el, value: idx };
});

const ordsRepairBarrierList = RepairBarrierValues.map((el, idx) => {
  return { label: el, value: idx };
});

type RepairerDropdownItem = {
  label: string;
  value: number;
  isOccupied?: boolean;
};

const UNASSIGNED_REPAIRER_IDX = -1;
const UNASSIGNED_REPAIRER_ITEM: RepairerDropdownItem = {
  label: "Unassigned",
  value: UNASSIGNED_REPAIRER_IDX,
};

const OCCUPIED_REPAIR_STATUSES = ["In Queue", "In Progress"];

const repairerMatchesVolunteer = (repair: Repair, volunteer: Volunteer): boolean => {
  const repairFirst = repair.repairerFirstName?.trim().toLowerCase() ?? "";
  const repairLast = repair.repairerLastName?.trim() ?? "";
  const volunteerFirst = volunteer.firstName?.trim().toLowerCase() ?? "";
  const volunteerLast = volunteer.lastName?.trim() ?? "";

  if (!repairFirst || repairFirst !== volunteerFirst) {
    return false;
  }

  if (!repairLast || !volunteerLast) {
    return !repairLast && !volunteerLast;
  }

  if (repairLast.toLowerCase() === volunteerLast.toLowerCase()) {
    return true;
  }

  const abbreviatedVolunteerLast = `${volunteerLast.charAt(0).toUpperCase()}.`;
  return repairLast === abbreviatedVolunteerLast;
};

const isVolunteerOccupied = (volunteer: Volunteer, repairs: Repair[], excludeRepairId?: string): boolean => {
  return repairs.some(
    (repair) =>
      repair._id !== excludeRepairId &&
      OCCUPIED_REPAIR_STATUSES.includes(repair.repairStatus) &&
      repairerMatchesVolunteer(repair, volunteer),
  );
};

const buildRepairerDropdownLists = (
  volunteers: Volunteer[],
  repairs: Repair[],
  excludeRepairId?: string,
): { available: RepairerDropdownItem[]; occupied: RepairerDropdownItem[] } => {
  const compareLabel = (a: RepairerDropdownItem, b: RepairerDropdownItem) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" });

  const items: RepairerDropdownItem[] = volunteers.map((volunteer, idx) => {
    const occupied = isVolunteerOccupied(volunteer, repairs, excludeRepairId);
    return {
      label: `${volunteer.firstName} ${volunteer.lastName}`,
      value: idx,
      isOccupied: occupied,
    };
  });

  return {
    available: items.filter((item) => !item.isOccupied).sort(compareLabel),
    occupied: items.filter((item) => item.isOccupied).sort(compareLabel),
  };
};

const getRepairerDropdownValue = (volunteers: Volunteer[], repairerIdx: number): RepairerDropdownItem | null => {
  if (repairerIdx === UNASSIGNED_REPAIRER_IDX) {
    return UNASSIGNED_REPAIRER_ITEM;
  }

  if (repairerIdx < 0 || !volunteers[repairerIdx]) {
    return null;
  }

  const volunteer = volunteers[repairerIdx];
  return {
    label: `${volunteer.firstName} ${volunteer.lastName}`,
    value: repairerIdx,
  };
};

const withUnassignedRepairerOption = (available: RepairerDropdownItem[]): RepairerDropdownItem[] => [
  UNASSIGNED_REPAIRER_ITEM,
  ...available,
];

const formatPreviousRepairer = (firstName?: string, lastName?: string): string => {
  const first = firstName?.trim() ?? "";
  const last = lastName?.trim() ?? "";
  if (!first && !last) {
    return "";
  }
  const initial = last ? `${last.charAt(0).toUpperCase()}.` : "";
  return [first, initial].filter(Boolean).join(" ");
};

/**
 * Add/Edit Repair component
 * @param {Object} route - the route object
 * @param {Object} navigation - the navigation object
 * @returns The component view
 */
const AddEditRepair = ({ route, navigation }) => {
  const [repairDetails, setRepairDetails] = useState(new Repair());
  const [waiverBoxChecked, setWaiverBoxChecked] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [availableRepairerList, setAvailableRepairerList] = useState<RepairerDropdownItem[]>([]);
  const [occupiedRepairerList, setOccupiedRepairerList] = useState<RepairerDropdownItem[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [eventRepairs, setEventRepairs] = useState<Repair[]>([]);
  const [repairerIdx, setRepairerIdx] = useState(UNASSIGNED_REPAIRER_IDX);
  const [showRepairerDropdown, setShowRepairerDropdown] = useState(false);
  const [statusIdx, setStatusIdx] = useState(-1);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [barrierIdx, setBarrierIdx] = useState(-1);
  const [showBarrierDropdown, setShowBarrierDropdown] = useState(false);
  const [productCategoryIdx, setProductCategoryIdx] = useState(UNSELECTED_PRODUCT_CATEGORY_IDX);
  const [productCategoryFocused, setProductCategoryFocused] = useState(false);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
  const [previousIncompleteRepairs, setPreviousIncompleteRepairs] = useState([]);
  const [previousRepairsFocused, setPreviousRepairsFocused] = useState(false);
  const [selectedPreviousRepairIdx, setSelectedPreviousRepairIdx] = useState(null);
  const [showPreviousRepairsDropdown, setShowPreviousRepairsDropdown] = useState(false);
  const [subscribedToNewsletter, setSubscribedToNewsletter] = useState(false);
  const [showSaveConfirmationDialog, setShowSaveConfirmationDialog] = useState(false);
  const [saveConfirmationDialogMsg, setSaveConfirmationDialogMsg] = useState("");
  const [previousRepairsList, setPrevoiusRepairsList] = useState([]);
  const { setShowLoader, setSnackbarMsg, appEvent } = useAuth();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  let emailInputRef = useRef<string>(null);

  const paramRepair = route.params.repair;

  /**
   * Check if a string is numeric
   * @param {string} str - the string to check
   * @returns {boolean} - true if the string is numeric, false otherwise
   */
  const isNumeric = (str: string): boolean => {
    return !isNaN(parseFloat(str)) && parseFloat(str) > 0;
  };

  /**
   * Check if the repair is ready to be saved
   * @param {Repair} repair - the repair to check
   * @returns {boolean} - true if the repair is ready to be saved, false otherwise
   */
  const repairOkToSave = (repair: Repair): boolean => {
    let msg = "";
    if (!waiverBoxChecked) {
      msg = "The Item Owner must agree to the terms at the top";
    } else if (!repair.ownersEmail) {
      msg = "Please enter the owner's email";
    } else if (!emailIsValid(repair.ownersEmail)) {
      msg = "Please enter a valid email";
    } else if (!repair.ownersFirstName) {
      msg = "Please enter the owner's first name";
    } else if (!repair.product) {
      msg = "Please enter the product";
    } else if (!repair.type) {
      msg = "Please select a product category";
    } else if (!repair.symptoms) {
      msg = "Please enter symptoms";
    } else if (!isNumeric(repair.weight)) {
      msg = "Please enter a valid weight";
    } else if (!isNumeric(repair.cost)) {
      msg = "Please enter a valid cost";
    }
    if (msg !== "") {
      setSnackbarMsg(msg);
      return false;
    }
    return true;
  };

  /**
   * Save the repair to the database
   * @returns {Promise<void>}
   */
  const saveRepair = async (): Promise<void> => {
    if (!appEvent._id) {
      setSnackbarMsg("Event not found. Please try again.");
      return;
    }

    repairDetails.eventId = appEvent._id;
    if (!repairOkToSave(repairDetails)) {
      return;
    }

    try {
      setShowLoader(true);
      if (!!repairDetails._id) {
        const res: Response<RepairData> = await updateRepair(repairDetails);
        setSnackbarMsg(res.msg);
      } else {
        const res: Response<RepairData> = await addFullRepair(repairDetails);
        setSnackbarMsg(res.msg);
      }
      navigation.navigate("Repairs");
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.message);
    } finally {
      setShowLoader(false);
    }
  };

  /**
   * Delete the current repair from the database
   * @returns {Promise}
   */
  const deleteCurrentRepair = async (): Promise<void> => {
    if (!repairDetails._id) {
      setSnackbarMsg("Repair can't be deleted. It doesn't have an _id.");
      return;
    }
    setShowLoader(false);
    try {
      const res: Response<RepairData> = await deleteRepair(repairDetails._id);
      setSnackbarMsg(res.msg);
      setTimeout(() => {
        navigation.navigate("Repairs");
      }, 500);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.message);
    } finally {
      setShowLoader(false);
    }
  };

  /**
   * Set the page title based on the repair's owner's first name
   * @param {Repair} repair - the repair to set the title for
   * @returns {void}
   */
  const setTitle = (repair: Repair): void => {
    if (!!repair?.ownersFirstName) {
      setPageTitle(`${repair.ownersFirstName}'s ${repair.type}`);
    } else {
      setPageTitle("New Repair");
    }
  };

  /**
   * Check if the repair is new
   * @param {Repair} repair - the repair to check
   * @returns {boolean} - true if the repair is new, false otherwise
   */
  const isNewRepair = (repair: Repair): boolean => {
    return !repair || !repair._id;
  };

  /**
   * Get repairs for the current event (used to determine busy repairers)
   * @returns {Promise<Repair[]>}
   */
  const refreshEventRepairs = async (): Promise<Repair[]> => {
    if (!appEvent?._id) {
      return [];
    }

    try {
      const res: Response<RepairsData> = await getRepairsByEvent(appEvent._id);
      return res.data.repairs ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  /**
   * Get the volunteers for the current event
   * @returns {Promise<void>}
   */
  const getVolunteers = async (): Promise<void> => {
    try {
      const [volRes, repairs]: [Response<VolunteersData>, Repair[]] = await Promise.all([
        getVolunteersByEvent(appEvent._id),
        refreshEventRepairs(),
      ]);

      setEventRepairs(repairs);

      if (volRes.data.volunteers.length <= 0) {
        setAvailableRepairerList([]);
        setOccupiedRepairerList([]);
        setVolunteers([]);
        return;
      }

      const tempVolunteers = volRes.data.volunteers;
      const { available, occupied } = buildRepairerDropdownLists(tempVolunteers, repairs, repairDetails._id);
      setVolunteers(tempVolunteers);
      setAvailableRepairerList(withUnassignedRepairerOption(available));
      setOccupiedRepairerList(occupied);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.message);
    }
  };

  /**
   * Initialize the repair status
   * @param {Repair} repair - the repair to initialize the status for
   * @returns {Repair} - the repair with the status initialized
   */
  const initStatus = (repair: Repair): Repair => {
    repair.repairStatus = RepairStatusValues[0];
    setStatusIdx(0);
    return repair;
  };

  /**
   * Get the full repair details
   * @param {Repair} repair - the repair to get the details for
   * @returns {Promise<void>}
   */
  const getFullRepair = async (repair: Repair): Promise<void> => {
    setShowLoader(true);
    if (isNewRepair(repair)) {
      setPageTitle("New Repair");
      repair = initStatus(repair);
      repair.type = "";
      setProductCategoryIdx(UNSELECTED_PRODUCT_CATEGORY_IDX);
      setRepairDetails(repair);
      setWaiverBoxChecked(repair.acceptsWaiver);
      setShowLoader(false);
      return;
    }

    try {
      const res: Response<RepairData> = await getRepair(repair._id);
      let fullRepair = res.data.repair;
      setTitle(fullRepair);
      if (!fullRepair.repairStatus) {
        fullRepair = initStatus(fullRepair);
      }
      if (!fullRepair.type) {
        setProductCategoryIdx(UNSELECTED_PRODUCT_CATEGORY_IDX);
      } else {
        const matchingIdx = ordsProductCategoryList.findIndex((cat) => cat.label === fullRepair.type);
        setProductCategoryIdx(matchingIdx >= 0 ? matchingIdx : UNSELECTED_PRODUCT_CATEGORY_IDX);
      }
      setRepairDetails(fullRepair);
      setWaiverBoxChecked(fullRepair.acceptsWaiver);
      getSetSubscriberStatus(fullRepair.ownersEmail);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.message);
    } finally {
      setShowLoader(false);
    }
  };

  /**
   * Triggered when the "Owner's email" field loses focus.
   * If the repair is new and the email is valid, it searches for the owner by email.
   * If the owner is found, it fills the owner's first and last name.
   * @returns {Promise<void>}
   */
  const onEmailBlur = async (): Promise<void> => {
    if (!!repairDetails._id || !emailIsValid(repairDetails.ownersEmail)) {
      return;
    }

    try {
      setShowLoader(true);
      const res: Response<OwnerData> = await findOwnerByEmail(repairDetails.ownersEmail);

      if (!res.data.owner) {
        return;
      }

      const owner = res.data.owner;
      setSubscribedToNewsletter(owner.subscribedToNewsletter);
      setRepairDetails({
        ...repairDetails,
        ownersFirstName: owner.firstName,
        ownersLastName: owner.lastName,
      });
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.message);
    } finally {
      setShowLoader(false);
    }
  };

  /**
   * Triggered when the "Subscribe to newsletter?" checkbox is checked or unchecked.
   * @param {boolean} checked - true if the checkbox is checked, false if it's unchecked
   * @returns {Promise<void>}
   */
  const onSubscribeToggled = async (checked: boolean): Promise<void> => {
    if (!repairDetails.ownersEmail) {
      setSnackbarMsg("Please enter the owner's email first.");
      // Reset checkbox
      setSubscribedToNewsletter(!checked);
      return;
    }

    try {
      setShowLoader(true);
      if (checked) {
        await subscribeEmailToNewsletter(repairDetails.ownersEmail);
        setSnackbarMsg(repairDetails.ownersEmail + " subscribed to newsletter.");
      } else {
        await unsubscribeEmailFromNewsletter(repairDetails.ownersEmail);
        setSnackbarMsg(repairDetails.ownersEmail + " unsubscribed from newsletter.");
      }
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.message);
    } finally {
      setShowLoader(false);
    }
  };

  /**
   * Triggered when the "Follow-up repair?" checkbox is checked or unchecked.
   * Searches for past uncompleted repairs for the same owner.
   * @param checked - true if the checkbox is checked, false if it's unchecked
   * @returns {Promise<void>}
   */
  const onFollowUpRepairToggled = async (checked: boolean): Promise<void> => {
    if (checked) {
      if (!repairDetails.ownersEmail) {
        setRepairDetails({
          ...repairDetails,
          isFollowUpRepair: false,
        });
        setSnackbarMsg("Please enter the owner's email first.");
        return;
      }
      try {
        setShowLoader(true);
        const res: Response<RepairsData> = await findIncompleteRepairsByOwner(repairDetails.ownersEmail);
        handlePreviousRepairs(res.data.repairs);
      } catch (error) {
        console.error(error);
        setSnackbarMsg(error.message);
      } finally {
        setShowLoader(false);
      }
    } else {
      setPreviousIncompleteRepairs([]);
      setSelectedPreviousRepairIdx(null);
      setRepairDetails((prev) => ({
        ...prev,
        previousRepairer: "",
      }));
    }
  };

  const handlePreviousRepairs = (previousRepairs: Repair[]) => {
    setPrevoiusRepairsList(previousRepairs);
    let previousRepairsDisplayList = [];
    previousRepairs.forEach((i: Repair, idx: number) => {
      previousRepairsDisplayList.push({
        label: `${i.type} - ${i.product} - ${i.symptoms}`,
        value: `${idx}`,
      });
    });
    setPreviousIncompleteRepairs(previousRepairsDisplayList);
  };

  /**
   * Fill the repair fields with the details of the selected previous repair
   * @param {number} idx - the index of the selected previous repair
   * @returns {Promise<void>}
   */
  const fillRepairFieldsFromPreviousRepair = async (idx: number): Promise<void> => {
    if (idx === null) {
      return;
    }

    const prevRepair = previousRepairsList[idx];
    const previousRepairer =
      formatPreviousRepairer(prevRepair.repairerFirstName, prevRepair.repairerLastName) ||
      prevRepair.previousRepairer ||
      "";

    setRepairDetails({
      ...repairDetails,
      product: prevRepair.product,
      type: prevRepair.type,
      brand: prevRepair.brand,
      model: prevRepair.model,
      symptoms: prevRepair.symptoms,
      repairerFirstName: "",
      repairerLastName: "",
      previousRepairer,
      repairNotes: prevRepair.repairNotes,
      repairStatus: "In Queue",
      weight: prevRepair.weight,
      cost: prevRepair.cost,
      isFollowUpRepair: true,
    });

    const matchingCategoryIdx = ordsProductCategoryList.findIndex((cat) => cat.label === prevRepair.type);
    setProductCategoryIdx(matchingCategoryIdx >= 0 ? matchingCategoryIdx : UNSELECTED_PRODUCT_CATEGORY_IDX);
  };

  /**
   * Get the subscriber status for the given email
   * @param {string} email - the email to check
   * @returns {Promise<void>}
   */
  const getSetSubscriberStatus = async (email: string): Promise<void> => {
    if (!email) {
      return;
    }

    try {
      setShowLoader(true);
      const res: Response<SubscribedData> = await getIsSubscribed(email);
      setSubscribedToNewsletter(res.data.isSubscribed);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.message);
    } finally {
      setShowLoader(false);
    }
  };

  /**
   * Rebuild the repairer dropdown when volunteers, event repairs, or the current repair changes
   */
  useEffect(() => {
    if (volunteers.length <= 0) {
      setAvailableRepairerList([]);
      setOccupiedRepairerList([]);
      return;
    }

    const { available, occupied } = buildRepairerDropdownLists(volunteers, eventRepairs, repairDetails._id);
    setAvailableRepairerList(withUnassignedRepairerOption(available));
    setOccupiedRepairerList(occupied);
  }, [volunteers, eventRepairs, repairDetails._id]);

  /**
   * Fetch the volunteers for the current event when the app event changes.
   */
  useEffect(() => {
    if (isNewRepair(paramRepair)) {
      if (emailInputRef.current) {
        emailInputRef.current?.focus();
      }
    }
    getVolunteers();
  }, [appEvent]);

  /**
   * Fetch the repair details when the component mounts
   */
  useEffect(() => {
    const fetchData = async () => {
      await getFullRepair(paramRepair);
    };
    fetchData();
  }, []);

  /**
   * Fetch and set whether the owner is subscribed to the newsletter
   * when the owner's email changes
   */
  useEffect(() => {
    getSetSubscriberStatus(repairDetails.ownersEmail);
  }, [repairDetails.ownersEmail]);

  /**
   * Set the repair status when the repair status index changes
   */
  useEffect(() => {
    if (statusIdx >= 0) {
      setRepairDetails((prev) => ({ ...prev, repairStatus: ordsRepairStatusList[statusIdx].label }));
    }
  }, [statusIdx]);

  /**
   * Set the repair barrier when the repair barrier index changes
   */
  useEffect(() => {
    if (barrierIdx >= 0) {
      setRepairDetails((prev) => ({ ...prev, repairBarrier: ordsRepairBarrierList[barrierIdx].label }));
    }
  }, [barrierIdx]);

  /**
   * Set the product category when the product category index changes
   */
  useEffect(() => {
    if (productCategoryIdx >= 0) {
      setRepairDetails((prev) => ({
        ...prev,
        type: ordsProductCategoryList[productCategoryIdx].label,
      }));
    }
  }, [productCategoryIdx]);

  /**
   * Set the repairer info when the repairer index changes
   */
  useEffect(() => {
    if (repairerIdx >= 0 && volunteers[repairerIdx]) {
      setRepairDetails((prev) => ({
        ...prev,
        repairerFirstName: volunteers[repairerIdx].firstName,
        repairerLastName: volunteers[repairerIdx].lastName,
      }));
    } else if (repairerIdx === UNASSIGNED_REPAIRER_IDX) {
      setRepairDetails((prev) => ({
        ...prev,
        repairerFirstName: "",
        repairerLastName: "",
      }));
    }
  }, [repairerIdx]);

  /**
   * Set the repair status index when the repair status changes
   */
  useEffect(() => {
    ordsRepairStatusList.forEach((s, idx) => {
      if (s.label === repairDetails.repairStatus) {
        setStatusIdx(idx);
      }
      return () => {
        setStatusIdx(-1);
      };
    });
  }, [repairDetails]);

  /**
   * Set the repair barrier index when the repair changes
   */
  useEffect(() => {
    ordsRepairBarrierList.forEach((s, idx) => {
      if (s.label === repairDetails.repairBarrier) {
        setBarrierIdx(idx);
      }
      return () => {
        setBarrierIdx(-1);
      };
    });
  }, [repairDetails]);

  /**
   * Set the repairer index when the repairer changes
   */
  useEffect(() => {
    if (!repairDetails.repairerFirstName?.trim() && !repairDetails.repairerLastName?.trim()) {
      setRepairerIdx(UNASSIGNED_REPAIRER_IDX);
      return;
    }

    const matchingIdx = volunteers.findIndex(
      (v) =>
        v.firstName.toLowerCase() === repairDetails.repairerFirstName.toLowerCase() &&
        v.lastName.toLowerCase() === repairDetails.repairerLastName.toLowerCase(),
    );

    setRepairerIdx(matchingIdx >= 0 ? matchingIdx : UNASSIGNED_REPAIRER_IDX);
  }, [volunteers, repairDetails.repairerFirstName, repairDetails.repairerLastName]);

  // Component's view
  return (
    <ScrollView contentContainerStyle={styles.topScrollView} style={{ backgroundColor: "#f2f2f2" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.content}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 22,
              alignSelf: "center",
            }}
          >
            {pageTitle}
          </Text>
          <CheckBox
            label={
              <Text style={{ fontWeight: "bold" }}>
                {"I agree to the "}
                <Text
                  style={{ color: "blue", fontWeight: "bold" }}
                  onPress={() => {
                    setTermsModalVisible(true);
                  }}
                >
                  {"terms and conditions"}
                </Text>
                <Text>?</Text>
                <Text style={{ color: "red" }}>*</Text>
                <Text style={{ color: "red" }}>{" (Must be checked by item owner)"}</Text>
              </Text>
            }
            status={waiverBoxChecked ? "checked" : "unchecked"}
            onPress={() => {
              setRepairDetails({ ...repairDetails, acceptsWaiver: !waiverBoxChecked });
              setWaiverBoxChecked(!waiverBoxChecked);
            }}
          />

          <TextInput
            label={
              <Text style={{ color: "#717171" }}>
                {"Owner's email "}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            }
            autoComplete={"off"}
            inputMode={"email"}
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={repairDetails.ownersEmail ?? ""}
            onBlur={onEmailBlur}
            ref={emailInputRef}
            onChangeText={(newEmail) => setRepairDetails({ ...repairDetails, ownersEmail: newEmail.trim() })}
          />
          <TextInput
            label={
              <Text style={{ color: "#717171" }}>
                {"Owner's first name "}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            }
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={repairDetails.ownersFirstName ?? ""}
            onChangeText={(newFirstName) =>
              setRepairDetails({ ...repairDetails, ownersFirstName: newFirstName.trim() })
            }
          />
          <TextInput
            label={<Text style={{ color: "#717171" }}>{"Owner's last initial "}</Text>}
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={repairDetails.ownersLastName ?? ""}
            onChangeText={(newLastName) => setRepairDetails({ ...repairDetails, ownersLastName: newLastName })}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <CheckBox
              label={
                <Text>
                  {"Is this a "}
                  <Text style={{ fontWeight: "bold" }}>{"follow-up repair"}</Text>
                  {"?"}
                </Text>
              }
              status={repairDetails.isFollowUpRepair ? "checked" : "unchecked"}
              onPress={() => {
                setRepairDetails({
                  ...repairDetails,
                  isFollowUpRepair: !repairDetails.isFollowUpRepair,
                });
                onFollowUpRepairToggled(!repairDetails.isFollowUpRepair);
              }}
            />
          </View>
          {previousIncompleteRepairs.length > 0 && (
            <View style={styles.dropdownContainer}>
              <View style={[styles.label]}>
                <Text style={{ color: "#717171" }}>Previous Repairs</Text>
              </View>
              <ElementDropdown
                style={[styles.dropdown, previousRepairsFocused && { borderWidth: 1 }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.itemTextStyle}
                iconStyle={styles.iconStyle as ImageStyle}
                data={previousIncompleteRepairs}
                search={false}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Previous Repair"
                value={selectedPreviousRepairIdx}
                onFocus={() => setPreviousRepairsFocused(true)}
                onBlur={() => setPreviousRepairsFocused(false)}
                onChange={(v) => {
                  setSelectedPreviousRepairIdx(v.value);
                  fillRepairFieldsFromPreviousRepair(v.value);
                }}
              />
            </View>
          )}
          <TextInput
            label={
              <Text style={{ color: "#717171" }}>
                {"Product"}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            }
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={repairDetails.product ?? ""}
            onChangeText={(newProduct) => setRepairDetails({ ...repairDetails, product: newProduct })}
            placeholder="e.g. Cordless vacuum, coffee maker, toaster, etc."
            placeholderTextColor={"#717171"}
          />
          {repairDetails.isFollowUpRepair && (
            <TextInput
              label="Previous Repairer"
              mode="outlined"
              autoCorrect={false}
              style={styles.short_text_input}
              value={repairDetails.previousRepairer ?? ""}
              onChangeText={(newPreviousRepairer) =>
                setRepairDetails({ ...repairDetails, previousRepairer: newPreviousRepairer })
              }
              placeholder="Jane D."
              placeholderTextColor={"#717171"}
            />
          )}

          <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
            <CheckBox
              label={<Text style={{ fontWeight: "normal" }}>{"Subscribe to the newsletter?"}</Text>}
              status={subscribedToNewsletter ? "checked" : "unchecked"}
              onPress={() => {
                setSubscribedToNewsletter(!subscribedToNewsletter);
                onSubscribeToggled(!subscribedToNewsletter);
              }}
            />
          </View>

          {/* Divider between owner fields and admin/repairer fields */}
          <View style={{ width: "100%", marginVertical: 20, alignItems: "center" }}>
            <Divider style={{ width: "100%", height: 1, backgroundColor: "#ccc" }} />
            <Text style={{ color: "#717171", fontSize: 12, marginTop: 8 }}>
              Fields below are for item owner or intake admins / repairers
            </Text>
          </View>

          <View style={styles.dropdownContainer}>
            <View style={[styles.label]}>
              <Text style={{ color: "#717171" }}>
                Product Category
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>
            <ElementDropdown
              style={[styles.dropdown, productCategoryFocused && { borderWidth: 1 }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemTextStyle={styles.itemTextStyle}
              iconStyle={styles.iconStyle as ImageStyle}
              data={ordsProductCategoryDropdownData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={PRODUCT_CATEGORY_PLACEHOLDER}
              searchPlaceholder="Search..."
              value={
                productCategoryIdx >= 0 ? ordsProductCategoryList[productCategoryIdx] : null
              }
              onFocus={() => setProductCategoryFocused(true)}
              onBlur={() => setProductCategoryFocused(false)}
              onChange={(v) => {
                if (v.value === null || v.value === undefined) {
                  return;
                }
                setProductCategoryIdx(v.value);
              }}
              renderItem={(item: ProductCategoryDropdownItem) => {
                if (item.isGroupLabel) {
                  return (
                    <Pressable disabled>
                      <Text style={{ fontWeight: "bold", paddingVertical: 8, paddingHorizontal: 12, color: "#49454f" }}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                }
                return (
                  <View style={{ paddingVertical: 8, paddingHorizontal: 12, paddingLeft: 28 }}>
                    <Text style={styles.itemTextStyle}>{item.label}</Text>
                  </View>
                );
              }}
            />
          </View>
          <TextInput
            label="Brand"
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={repairDetails.brand ?? ""}
            onChangeText={(newBrand) => setRepairDetails({ ...repairDetails, brand: newBrand })}
            placeholder="Sony / Philips / Unknown / n.a."
            placeholderTextColor={"#717171"}
          />
          <TextInput
            label="Model"
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={repairDetails.model ?? ""}
            onChangeText={(newModel) => setRepairDetails({ ...repairDetails, model: newModel })}
            placeholder="Senseo HD 7850 / iPhone 15 / ..."
            placeholderTextColor={"#717171"}
          />
          <TextInput
            label={
              <Text style={{ color: "#717171" }}>
                {"Symptoms "}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            }
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={repairDetails.symptoms ?? ""}
            onChangeText={(newSymptoms) => setRepairDetails({ ...repairDetails, symptoms: newSymptoms })}
            placeholder="Doesn't turn on / no sound / won't heat / ..."
            placeholderTextColor={"#717171"}
          />
          <TextInput
            label={
              <Text style={{ color: "#717171" }}>
                {`Weight (${WEIGHT_UNITS})`}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            }
            inputMode={"decimal"}
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            placeholder="Rought estimate is fine"
            placeholderTextColor={"#717171"}
            value={repairDetails.weight ? repairDetails.weight.toString() : ""}
            onChangeText={(newWeight) => setRepairDetails({ ...repairDetails, weight: newWeight })}
          />
          <TextInput
            label={
              <Text style={{ color: "#717171" }}>
                {`Replacement Cost (${COST_UNITS})`}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            }
            mode="outlined"
            inputMode={"decimal"}
            autoCorrect={false}
            style={styles.short_text_input}
            placeholder="Rough estimate is fine"
            placeholderTextColor={"#717171"}
            value={repairDetails.cost ? repairDetails.cost.toString() : ""}
            onChangeText={(newCost) => setRepairDetails({ ...repairDetails, cost: newCost })}
          />

          {/* Divider between cost fields and repair notes fields */}
          <View style={{ width: "100%", marginVertical: 20, alignItems: "center" }}>
            <Divider style={{ width: "100%", height: 1, backgroundColor: "#ccc" }} />
            <Text style={{ color: "#717171", fontSize: 12, marginTop: 8 }}>
              Fields below are for intake admins / repairers
            </Text>
          </View>

          <TextInput
            label="Repair Notes"
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={repairDetails.repairNotes ?? ""}
            onChangeText={(newNotes) => setRepairDetails({ ...repairDetails, repairNotes: newNotes })}
            placeholder="Fuse was blown. Replaced. / Soldered severed wire / ..."
            placeholderTextColor={"#717171"}
          />
          {volunteers.length > 0 && (
            <>
              <View style={styles.dropdownContainer}>
                <View style={[styles.label]}>
                  <Text style={{ color: "#717171" }}>Repairer</Text>
                </View>
                <ElementDropdown
                  placeholder={"Select repairer"}
                  value={getRepairerDropdownValue(volunteers, repairerIdx)}
                  data={availableRepairerList}
                  style={[styles.dropdown, { flex: 0, minHeight: 50 }, showRepairerDropdown && { borderWidth: 1 }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={styles.itemTextStyle}
                  iconStyle={styles.iconStyle as ImageStyle}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  flatListProps={{
                    ListFooterComponent:
                      occupiedRepairerList.length > 0
                        ? () => (
                            <View>
                              {occupiedRepairerList.map((item) => (
                                <View key={item.value} style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
                                  <Text style={[styles.itemTextStyle, { color: "#bbb" }]}>{item.label}</Text>
                                </View>
                              ))}
                            </View>
                          )
                        : undefined,
                  }}
                  onFocus={async () => {
                    setShowRepairerDropdown(true);
                    const repairs = await refreshEventRepairs();
                    setEventRepairs(repairs);
                  }}
                  onBlur={() => setShowRepairerDropdown(false)}
                  onChange={(v) => {
                    setRepairerIdx(v.value);
                  }}
                />
              </View>
              <HelperText type="info" visible={true} style={{ marginTop: -8, marginBottom: 8 }}>
                Available repairers are listed first. Gray names already have an item In Queue or In Progress.
              </HelperText>
            </>
          )}
          <View style={styles.dropdownContainer}>
            <View style={[styles.label]}>
              <Text style={{ color: "#717171" }}>
                Repair Status
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>
            <ElementDropdown
              placeholder={"Repair Status"}
              value={ordsRepairStatusList[statusIdx]}
              data={ordsRepairStatusList}
              style={[styles.dropdown, showStatusDropdown && { borderWidth: 1 }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemTextStyle={styles.itemTextStyle}
              iconStyle={styles.iconStyle as ImageStyle}
              maxHeight={300}
              labelField="label"
              valueField="value"
              onFocus={() => setShowStatusDropdown(true)}
              onBlur={() => setShowStatusDropdown(false)}
              onChange={(v) => {
                setStatusIdx(v.value);
              }}
            />
          </View>
          {statusIdx >= 0 && ordsRepairStatusList[statusIdx].label === "End of life" && (
            <View style={{ marginTop: 10, width: "100%" }}>
              <PaperDropDown
                label={"Repair Barrier"}
                mode="outlined"
                visible={showBarrierDropdown}
                showDropDown={() => setShowBarrierDropdown(true)}
                onDismiss={() => setShowBarrierDropdown(false)}
                value={barrierIdx}
                setValue={setBarrierIdx}
                list={ordsRepairBarrierList}
              />
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            {!!repairDetails._id && (
              <SubmitButton
                icon={() => <FontAwesome5 name="trash-alt" size={18} color="white" />}
                style={{
                  ...styles.deleteButton,
                  flex: 1,
                }}
                rippleColor="rgba(168,37,33,0.4)"
                onPress={() => {
                  setShowDeleteConfirmationDialog(true);
                }}
              ></SubmitButton>
            )}
            <SubmitButton
              icon={() => <FontAwesome5 name="save" size={24} color="white" iconStyle="solid" />}
              style={{
                flex: 1,
                marginHorizontal: 5,
              }}
              rippleColor="#285882"
              onPress={() => {
                if (eventInThePast(appEvent)) {
                  if (repairDetails._id) {
                    setSaveConfirmationDialogMsg(
                      "You are editing a repair from a past event. Are you sure you want to save it?",
                    );
                  } else {
                    setSaveConfirmationDialogMsg(
                      "You are adding a repair to a past event. Are you sure you want to save it?",
                    );
                  }
                  setShowSaveConfirmationDialog(true);
                } else if (eventInTheFuture(appEvent)) {
                  if (repairDetails._id) {
                    setSaveConfirmationDialogMsg(
                      "You are editing a repair from a future event. Are you sure you want to save it?",
                    );
                  } else {
                    setSaveConfirmationDialogMsg(
                      "You are adding a repair to a future event. Are you sure you want to save it?",
                    );
                  }
                  setShowSaveConfirmationDialog(true);
                } else {
                  saveRepair();
                }
              }}
            />
          </View>
        </View>

        {termsModalVisible && (
          <View
            style={{
              position: "absolute",
              top: 5,
              left: "50%",
              transform: [{ translateX: -0.5 * screenWidth }],
              height: 0.7 * screenHeight,
              maxWidth: 0.8 * screenWidth,
              minWidth: 320,
            }}
          >
            <Text
              onPress={() => {
                setTermsModalVisible(false);
              }}
              style={{
                fontSize: 22,
                marginLeft: "auto",
                paddingRight: 5,
              }}
            >
              {"Close"}
            </Text>
            <Terms />
          </View>
        )}

        <Portal>
          <Dialog
            style={{
              minWidth: 320,
              maxWidth: 738,
              alignSelf: "center",
            }}
            visible={showDeleteConfirmationDialog}
            onDismiss={() => {
              setShowDeleteConfirmationDialog(false);
            }}
          >
            <Dialog.Title>{"\u26A0 Alert"}</Dialog.Title>
            <Dialog.Content>
              <Text>
                Are you sure you want to delete {repairDetails.ownersFirstName} {repairDetails.ownersLastName}'s{" "}
                {repairDetails.type}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setShowDeleteConfirmationDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  deleteCurrentRepair();
                  setShowDeleteConfirmationDialog(false);
                }}
                labelStyle={{ color: "red" }}
              >
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog
            style={{
              minWidth: 320,
              maxWidth: 738,
              alignSelf: "center",
            }}
            visible={showSaveConfirmationDialog}
            onDismiss={() => {
              setShowSaveConfirmationDialog(false);
            }}
          >
            <Dialog.Title style={{ color: "red" }}>{"\u26A0 Alert"}</Dialog.Title>
            <Dialog.Content>
              <Text>{saveConfirmationDialogMsg}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setShowSaveConfirmationDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  saveRepair();
                  setShowSaveConfirmationDialog(false);
                }}
                labelStyle={{ color: "red" }}
              >
                Save
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AddEditRepair;
