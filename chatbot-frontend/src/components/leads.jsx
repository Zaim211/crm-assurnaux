// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Space,
//   Modal,
//   Form,
//   Input,
//   Select,
//   message,
//   Popconfirm,
//   Upload,
//   Breadcrumb,
//   Avatar,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   UploadOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import "tailwindcss/tailwind.css";

// const { Option } = Select;
// const clientTypes = [
//   { label: "Tous", value: "all" },
//   { label: "Prospect VRG", value: "Prospect_vrg" },
//   { label: "Client Actif", value: "client_actif" },
//   { label: "Prospect QLF", value: "prospect_vr" },
//   { label: "Hors planning", value: "hors_planning" },
// ];

// const CoachList = () => {
//   const navigate = useNavigate();
//   const [specialities, setSpecialities] = useState([]);
//   const [commercials, setCommercials] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
//   const [isUnassignModalVisible, setIsUnassignModalVisible] = useState(false);
//   const [currentCoach, setCurrentCoach] = useState(null);
//   const [selectedCoaches, setSelectedCoaches] = useState([]);
//   const [form] = Form.useForm();
//   const [assignForm] = Form.useForm();
//   const [unassignForm] = Form.useForm();
//   const [uploading, setUploading] = useState(false);
//   const [uploadedFileName, setUploadedFileName] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [fileList, setFileList] = useState([]);
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 12 });
//   const [coaches, setCoaches] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [filterType, setFilterType] = useState("all");
//   const [contracts, setContracts] = useState([]);
//   const [filteredContracts, setFilteredContracts] = useState([]);
//   const [activeCoaches, setActiveCoaches] = useState([]);
//   const [prospectCoaches, setProspectCoaches] = useState([]);
//   const [filteredCoaches, setFilteredCoaches] = useState([]);
//   const [filteredCoachesPlanning, setFilteredCoachesPlanning] = useState([]);
//   const [prospectCoachesVRG, setProspectCoachesVRG] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [dataPlanning, setDataPlanning] = useState([]);
//   const [showCount, setShowCount] = useState(true);
//   const [allCoaches, setAllCoaches] = useState([]);

//   const handleColumnSearch = async (e, columnKey) => {
//     const value = e.target.value.toLowerCase().trim();
//     setSearchQuery(value);

//     try {
//       // If search value is empty, reset the filtered data
//       if (value === "") {
//         setFilteredData(coaches);
//         return;
//       }

//       // Handle 'commercial' search separately
//       if (columnKey === "commercial") {
//         const filteredData = coaches.filter((item) => {
//           const commercialValue = item[columnKey]
//             ? `${item[columnKey].prenom} ${item[columnKey].nom}`.toLowerCase()
//             : "n/a"; // Handle null or empty cases

//           return commercialValue.includes(value);
//         });
//         setFilteredData(filteredData);
//         return;
//       }

//       // Default search for other columns
//       const response = await axios.get(
//         "https://gokosports.fr/api/search-by-column",
//         {
//           params: { query: value, columnKey },
//         }
//       );

//       setFilteredData(response.data);
//     } catch (error) {
//       console.error("Error in search:", error);
//       message.error("Error while searching.");
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, [pagination.current]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("No token found, please login first");
//         return;
//       }

//       const { current: page, pageSize: limit } = pagination;
//       const queryParams = { page, limit };

//       // Fetch data for coaches, specialities, and commercials concurrently
//       const [coachesResponse, specialitiesResponse, commercialsResponse] =
//         await Promise.all([
//           axios.get("https://gokosports.fr/coaches/allCoaches", {
//             headers: { Authorization: `Bearer ${token}` },
//             params: queryParams,
//           }),
//           axios.get("https://gokosports.fr/speciality"),
//           axios.get("https://gokosports.fr/commercials"),
//         ]);

//       // Set the state with the fetched data
//       setAllCoaches(coachesResponse.data.coaches);
//       setFilteredData(coachesResponse.data.coaches);
//       setPagination((prev) => ({
//         ...prev,
//         total: coachesResponse.data.totalCoaches,
//       }));

//       setSpecialities(specialitiesResponse.data);
//       setCommercials(commercialsResponse.data);

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       message.error("Failed to fetch data");
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchCoaches();
//     fetchContracts();
//     fetchPlannings();
//   }, []);

//   const fetchPlannings = async () => {
//     setLoading(true);
//     try {
//       // Fetch planning data
//       const planningResponse = await axios.get(
//         `https://gokosports.fr/api/planning`
//       );

//       // Fetch coaches data
//       const token = localStorage.getItem("token");
//       const coachesResponse = await axios.get("https://gokosports.fr/coaches", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Extract coach IDs from planning data with call situation "Hors planning"
//       const coachIds = planningResponse.data
//         .filter(
//           (planning) =>
//             planning.callSituation === "Hors planning" ||
//             planning.callSituation === "Canceled" ||
//             planning.callSituation === "Ne répond pas" ||
//             planning.callSituation === "Ne pas déranger" ||
//             planning.callSituation === "Faux numéro // Hors planning"
//         )
//         .map((planning) => planning.coachId);

//       // Filter coaches based on the extracted coach IDs
//       const filteredCoachesData = coachesResponse.data.filter((coach) =>
//         coachIds.includes(coach._id)
//       );

//       setFilteredCoachesPlanning(filteredCoachesData);
//     } catch (error) {
//       console.error("Error fetching planning or coaches:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCoaches = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       // if (!token) {
//       //   message.error("No token found, please login first");
//       //   return;
//       // }
//       setLoading(true);
//       const response = await axios.get("https://gokosports.fr/coaches", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Coaches Data:", response.data);
//       setCoaches(response.data);
//       setFilteredClients(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching coaches:", error);
//       setLoading(false);
//     }
//   };

//   const fetchContracts = async () => {
//     try {
//       const response = await axios.get("https://gokosports.fr/api/contracts");
//       setContracts(response.data);
//       setFilteredContracts(response.data);
//     } catch (error) {
//       console.error("Error fetching contracts:", error);
//     }
//   };

//   const handleFilterClick = async (type) => {
//     setFilterType(type);
//     setShowCount(false);
//     let filtered = [];

//     if (type === "client_actif") {
//       // Get coaches with contracts
//       filtered = coaches.filter((coach) => {
//         const hasContract = contracts.some((contract) => {
//           const hasRaisonSocialMatch =
//             // contract.raisonsociale &&
//             // coach.raisonsociale &&
//             // contract.raisonsociale.toLowerCase() ===
//             //   coach.raisonsociale.toLowerCase() ||
//             contract.email === coach.email ||
//             contract.phone === coach.phone ||
//             contract.raisonsociale === coach.raisonsociale;

//           const isContractValid = contract.status === "validé";

//           return hasRaisonSocialMatch && isContractValid;
//         });
//         return hasContract;
//       });

//       setActiveCoaches(filtered);
//       setProspectCoaches([]);
//       setFilteredCoaches([]);
//     } else if (type === "Prospect_vrg") {
//       try {
//         // // Step 3: Filter out coaches with either planning or contracts
//         // filtered = coaches.filter((coach) => {
//         //   const hasContract = contracts.some((contract) => {
//         //     const hasRaisonSocialMatch =
//         //       contract.email === coach.email ||
//         //       contract.phone === coach.phone ||
//         //       contract.raisonsociale === coach.raisonsociale;

//         //     const isContractValid = contract.status === "validé" ||
//         //     contract.status === "pending" ||
//         //     contract.status === "non validé" ||
//         //     !contract.status ||
//         //     contract.status === "undefined";

//         //     // return hasPhoneMatch || hasRaisonSocialMatch;
//         //     return hasRaisonSocialMatch && isContractValid;
//         //   });
//         //   return !hasContract;
//         // });
//         // Fetch planning data
//         const planningResponse = await axios.get(
//           `https://gokosports.fr/api/planning`
//         );
//         console.log("Planning Data:", planningResponse.data);

//         const planningCallSituations = [
//           "Appel de vente",
//           "Négociation devis",
//           "Conclusion vente",
//           "Vente",
//           "Appel de fidélisation",
//           "Ne répond pas",
//           "Faux numéro // Hors planning",
//           "Ne pas déranger",
//           "Hors planning",
//           "Canceled",
//           "Rappel",
//           "Scheduled",
//           "Ne répond pas",
//         ];

//         // Create a map of coachId to call situations and comments
//         const planningMap = planningResponse.data.reduce((acc, planning) => {
//           if (planningCallSituations.includes(planning.callSituation)) {
//             if (!acc[planning.coachId]) {
//               acc[planning.coachId] = { callSituations: [], comments: [] };
//             }
//             acc[planning.coachId].callSituations.push(planning.callSituation);

//             // Add the comment to the map if it exists
//             if (planning.comment) {
//               acc[planning.coachId].comments.push(planning.comment);
//             }
//           }
//           return acc;
//         }, {});

//         // Step 3: Filter out coaches with either planning or contracts
//         filtered = coaches.filter((coach) => {
//           // Check if coach has a valid contract
//           const hasContract = contracts.some((contract) => {
//             const hasRaisonSocialMatch =
//               contract.email === coach.email ||
//               contract.phone === coach.phone ||
//               contract.raisonsociale === coach.raisonsociale;

//             const isContractValid =
//               contract.status === "validé" ||
//               contract.status === "pending" ||
//               contract.status === "non validé" ||
//               !contract.status; // Allow empty status

//             return hasRaisonSocialMatch && isContractValid; // Keep contracted
//           });

//           // Check if coach has planning data
//           const hasPlanning = planningMap[coach._id];
//           const hasEmptyCommentaires =
//             coach.commentaires && coach.commentaires.length === 0;

//           // Keep coaches who have neither a valid contract nor planning data
//           return !hasContract && !hasPlanning && hasEmptyCommentaires;
//         });
//         console.log("Filtered Coaches:", filtered);

//         // // Add planning data to the filtered coaches
//         // filtered = filtered.map((coach) => ({
//         //   ...coach,
//         //   callSituations: planningMap[coach._id]?.callSituations || [], // Add callSituations if any
//         //   comment: planningMap[coach._id]?.comments.join(", ") || "", // Combine all comments into a single string
//         // }));

//         setProspectCoachesVRG(filtered); // Set filtered coaches without planning or contract
//         setFilteredCoaches([]); // Clear filtered coaches
//         setActiveCoaches([]); // Clear active coaches
//         setProspectCoaches([]); // Clear prospect coaches
//       } catch (error) {
//         console.error("Error fetching data or filtering coaches:", error);
//       }
//     } else if (type === "prospect_vr") {
//       //Get coaches without contracts
//       filtered = coaches.filter((coach) => {
//         const hasNoContract = contracts.some((contract) => {
//           const hasRaisonSocialMatch =
//             contract.email === coach.email ||
//             contract.phone === coach.phone ||
//             contract.raisonsociale === coach.raisonsociale;

//           const isContractValid =
//             contract.status === "pending" ||
//             contract.status === "non validé" ||
//             !contract.status ||
//             !contract.status === "undefined";

//           return isContractValid && hasRaisonSocialMatch;
//         });
//         return hasNoContract;
//       });

//       setProspectCoaches(filtered);
//       setActiveCoaches([]);
//       setFilteredCoaches([]);
//     } else if (type === "hors_planning") {
//       const planningResponse = await axios.get(
//         `https://gokosports.fr/api/planning`
//       );
//       console.log("Planning Data:", planningResponse.data);

//       const planningCallSituations = [
//         "Hors planning",
//         "Canceled",
//         "Ne répond pas",
//         "Ne pas déranger",
//         "Faux numéro // Hors planning",
//       ];

//       // Create a map of coachId to call situations and comments
//       const planningMap = planningResponse.data.reduce((acc, planning) => {
//         if (planningCallSituations.includes(planning.callSituation)) {
//           if (!acc[planning.coachId]) {
//             acc[planning.coachId] = { callSituations: [], comments: [] };
//           }
//           acc[planning.coachId].callSituations.push(planning.callSituation);

//           // Add the comment to the map if it exists
//           if (planning.comment) {
//             acc[planning.coachId].comments.push(planning.comment);
//           }
//         }
//         return acc;
//       }, {});

//       // Filter and map coaches to include callSituations and comments
//       filtered = coaches
//         .filter((coach) => planningMap[coach._id])
//         .map((coach) => ({
//           ...coach,
//           callSituations: planningMap[coach._id].callSituations, // Add callSituations
//           comment: planningMap[coach._id].comments.join(", "), // Combine all comments into a single string
//         }));

//       // Step 3: Log the coaches with their call situations and comments
//       console.log(
//         "Filtered Coaches with Call Situations and Comments:",
//         filtered
//       );

//       setFilteredCoaches(filtered);
//       setActiveCoaches([]);
//       setProspectCoaches([]);
//     }
//     if (type === "all") {
//       try {
//         // Fetch coaches data
//         const coachesResponse = await axios.get(
//           "https://gokosports.fr/coaches/allCoaches"
//         );

//         // Fetch planning data
//         const planningResponse = await axios.get(
//           "https://gokosports.fr/api/planning"
//         );
//         const planningData = planningResponse.data;

//         // Map comments to coaches
//         const combinedData = coachesResponse.data?.map((coach) => {
//           const planning = planningData.find(
//             (plan) => plan.coachId === coach._id
//           );
//           return {
//             ...coach,
//             comment: planning ? planning.comment : "No comment",
//             callSituations: planning ? planning.callSituations : "No call",
//           };
//         });

//         setCoaches(combinedData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//       setShowCount(true);
//     }
//   };

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setCoaches(filteredClients);
//     } else {
//       const delayDebounceFn = setTimeout(() => {
//         handleSearch();
//       }, 1000);
//       return () => clearTimeout(delayDebounceFn);
//     }
//   }, [searchQuery]);

//   const handleSearch = async () => {
//     try {
//       setLoading(true);

//       // If searchQuery is empty, we can decide what to do based on filterType
//       if (searchQuery.trim() === "") {
//         let updatedCoaches = [];
//         if (filterType === "client_actif") {
//           updatedCoaches = coaches.filter((coach) => {
//             // Check if any of the contracts match the coach's phone and are valid
//             const isValid = contracts.some((contract) => {
//               const isContractValid = contract.status === "validé";
//               const hasPhoneMatch = contract.phone === coach.phone;

//               return hasPhoneMatch && isContractValid;
//             });

//             return isValid;
//           });
//           setActiveCoaches(updatedCoaches);
//         } else if (filterType === "Prospect_vrg" && searchQuery.trim() === "") {
//           try {
//             const planningResponse = await axios.get(
//               `https://gokosports.fr/api/planning`
//             );
//             console.log("Planning Data:", planningResponse.data);

//             const planningCallSituations = [
//               "Appel de vente",
//               "Négociation devis",
//               "Conclusion vente",
//               "Vente",
//               "Appel de fidélisation",
//               "Ne répond pas",
//               "Faux numéro // Hors planning",
//               "Ne pas déranger",
//               "Hors planning",
//               "Canceled",
//               "Rappel",
//               "Scheduled",
//               "Ne répond pas",
//             ];

//             // Create a map of coachId to call situations and comments
//             const planningMap = planningResponse.data.reduce(
//               (acc, planning) => {
//                 if (planningCallSituations.includes(planning.callSituation)) {
//                   if (!acc[planning.coachId]) {
//                     acc[planning.coachId] = {
//                       callSituations: [],
//                       comments: [],
//                     };
//                   }
//                   acc[planning.coachId].callSituations.push(
//                     planning.callSituation
//                   );

//                   // Add the comment to the map if it exists
//                   if (planning.comment) {
//                     acc[planning.coachId].comments.push(planning.comment);
//                   }
//                 }
//                 return acc;
//               },
//               {}
//             );

//             // Step 3: Filter out coaches with either planning or contracts
//             const filtered = coaches.filter((coach) => {
//               // Check if coach has a valid contract
//               const hasContract = contracts.some((contract) => {
//                 const hasRaisonSocialMatch =
//                   contract.email === coach.email ||
//                   contract.phone === coach.phone ||
//                   contract.raisonsociale === coach.raisonsociale;

//                 const isContractValid =
//                   contract.status === "validé" ||
//                   contract.status === "pending" ||
//                   contract.status === "non validé" ||
//                   !contract.status; // Allow empty status

//                 return hasRaisonSocialMatch || isContractValid; // Keep contracted
//               });

//               // Check if coach has planning data
//               const hasPlanning = planningMap[coach._id];
//               const hasEmptyCommentaires =
//                 coach.commentaires && coach.commentaires.length === 0;

//               // Keep coaches who have neither a valid contract nor planning data
//               return !hasContract && !hasPlanning && hasEmptyCommentaires;
//             });
//             // Extract the _id values of the filtered coaches
//             const validCoachIds = filtered.map((coach) => coach._id);
//             const updatedCoaches = response.data.filter((coach) =>
//               validCoachIds.includes(coach._id)
//             );

//             setProspectCoachesVRG(updatedCoaches);
//           } catch (error) {
//             console.error(
//               "Error fetching planning or filtering coaches for Prospect_vrg:",
//               error
//             );
//           }
//         } else if (filterType === "Prospect_vr") {
//           updatedCoaches = coaches.filter(
//             (coach) =>
//               !contracts.some((contract) => {
//                 const hasPhoneMatch = contract.phone === coach.phone;
//                 // const hasRaisonSocialMatch =
//                 //   contract.raisonsociale &&
//                 //   coach.raisonsociale &&
//                 //   contract.raisonsociale.toLowerCase() ===
//                 //     coach.raisonsociale.toLowerCase();
//                 return hasPhoneMatch;
//               })
//           );
//           setProspectCoaches(updatedCoaches);
//         } else if (filterType === "hors_planning") {
//           try {
//             // Fetch planning data
//             const planningResponse = await axios.get(
//               `https://gokosports.fr/api/planning`
//             );
//             console.log("Planning Data:", planningResponse.data);

//             // Extract coach IDs from planning data
//             const coachIds = planningResponse.data
//               .filter(
//                 (planning) =>
//                   planning.callSituation === "Hors planning" ||
//                   planning.callSituation === "Canceled" ||
//                   planning.callSituation === "Ne répond pas" ||
//                   planning.callSituation === "Ne pas déranger" ||
//                   planning.callSituation === "Faux numéro // Hors planning"
//               )
//               .map((planning) => planning.coachId);

//             console.log("Coach IDs:", coachIds);

//             // Filter coaches based on the extracted coach IDs
//             updatedCoaches = coaches.filter(
//               (coach) => coachIds.includes(coach._id.toString()) // Ensure the types match
//             );

//             console.log("Filtered Coaches:", updatedCoaches);
//             setFilteredCoachesPlanning(updatedCoaches);
//           } catch (error) {
//             console.error("Error fetching planning data:", error);
//           }
//         }
//       } else {
//         // If searchQuery is not empty, perform the search
//         const response = await axios.get(
//           `https://gokosports.fr/api/search?search=${searchQuery}`
//         );
//         console.log("Search response:", response.data);

//         let updatedCoaches = [];

//         if (filterType === "client_actif") {
//           updatedCoaches = response.data.filter((coach) =>
//             contracts.some((contract) => {
//               const hasPhoneMatch = contract.phone === coach.phone;
//               const hasRaisonSocialMatch =
//                 contract.raisonsociale &&
//                 coach.raisonsociale &&
//                 contract.raisonsociale.toLowerCase() ===
//                   coach.raisonsociale.toLowerCase();
//               return hasPhoneMatch || hasRaisonSocialMatch;
//             })
//           );
//           setActiveCoaches(updatedCoaches);
//         } else if (filterType === "Prospect_vrg") {
//           try {
//             const planningResponse = await axios.get(
//               `https://gokosports.fr/api/planning`
//             );
//             console.log("Planning Data:", planningResponse.data);

//             const planningCallSituations = [
//               "Appel de vente",
//               "Négociation devis",
//               "Conclusion vente",
//               "Vente",
//               "Appel de fidélisation",
//               "Ne répond pas",
//               "Faux numéro // Hors planning",
//               "Ne pas déranger",
//               "Hors planning",
//               "Canceled",
//               "Rappel",
//               "Scheduled",
//               "Ne répond pas",
//             ];

//             // Create a map of coachId to call situations and comments
//             const planningMap = planningResponse.data.reduce(
//               (acc, planning) => {
//                 if (planningCallSituations.includes(planning.callSituation)) {
//                   if (!acc[planning.coachId]) {
//                     acc[planning.coachId] = {
//                       callSituations: [],
//                       comments: [],
//                     };
//                   }
//                   acc[planning.coachId].callSituations.push(
//                     planning.callSituation
//                   );

//                   // Add the comment to the map if it exists
//                   if (planning.comment) {
//                     acc[planning.coachId].comments.push(planning.comment);
//                   }
//                 }
//                 return acc;
//               },
//               {}
//             );

//             // Step 3: Filter out coaches with either planning or contracts
//             const filtered = coaches.filter((coach) => {
//               // Check if coach has a valid contract
//               const hasContract = contracts.some((contract) => {
//                 const hasRaisonSocialMatch =
//                   contract.email === coach.email ||
//                   contract.phone === coach.phone ||
//                   contract.raisonsociale === coach.raisonsociale;

//                 const isContractValid =
//                   contract.status === "validé" ||
//                   contract.status === "pending" ||
//                   contract.status === "non validé" ||
//                   !contract.status; // Allow empty status

//                 return hasRaisonSocialMatch && isContractValid; // Keep contracted
//               });

//               // Check if coach has planning data
//               const hasPlanning = planningMap[coach._id];
//               const hasEmptyCommentaires =
//                 coach.commentaires && coach.commentaires.length === 0;

//               // Keep coaches who have neither a valid contract nor planning data
//               return !hasContract && !hasPlanning && hasEmptyCommentaires;
//             });
//             // Extract the _id values of the filtered coaches
//             const validCoachIds = filtered.map((coach) => coach._id);

//             // Now filter response.data based on _id match
//             const updatedCoaches = response.data.filter((coach) =>
//               validCoachIds.includes(coach._id)
//             );

//             console.log("CoachesVRG1:", updatedCoaches);

//             // Update state
//             setProspectCoachesVRG(updatedCoaches);
//           } catch (error) {
//             console.error(
//               "Error fetching planning or filtering coaches for Prospect_vrg:",
//               error
//             );
//           }
//         } else if (filterType === "prospect_vr") {
//           updatedCoaches = response.data.filter((coach) =>
//             contracts.some(
//               (contract) =>
//                 (contract.phone === coach.phone ||
//                   contract.raisonsociale === coach.raisonsociale) &&
//                 ["pending", "non validé"].includes(contract.status)
//             )
//           );
//           setProspectCoaches(updatedCoaches);
//           // setProspectCoaches(updatedCoaches);
//         } else if (filterType === "hors_planning") {
//           const planningResponse = await axios.get(
//             `https://gokosports.fr/api/planning`
//           );
//           const planningCallSituations = [
//             "Hors planning",
//             "Canceled",
//             "Ne répond pas",
//             "Ne pas déranger",
//             "Faux numéro // Hors planning",
//           ];

//           const coachIds = planningResponse.data
//             .filter((planning) =>
//               planningCallSituations.includes(planning.callSituation)
//             )
//             .map((planning) => planning.coachId);

//           updatedCoaches = response.data.filter((coach) =>
//             coachIds.includes(coach._id)
//           );
//           console.log("Filtered Coaches test:", updatedCoaches);
//           setFilteredCoaches(updatedCoaches);
//         }
//       }

//       setPagination({ current: 1, pageSize: 8 }); // Reset pagination for new data
//     } catch (error) {
//       console.error("Error searching coaches:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // const handleSearch = async () => {
//   //   try {
//   //     // Perform the search with postal code filter
//   //     setLoading(true);
//   //     const response = await axios.get(
//   //       `https://gokosports.fr/api/search?search=${searchQuery}`
//   //     );
//   //     console.log("Search response:", response.data);

//   //     // Update coaches with filtered data
//   //     setCoaches(response.data);
//   //     setPagination({ current: 1, pageSize: 8 }); // Reset pagination for filtered results
//   //   } catch (error) {
//   //     console.error("Error searching coaches:", error);
//   //     setCoaches(filteredClients); // Reset to original state if search fails
//   //   } finally {
//   //     setLoading(false); // Stop loading after search completes
//   //   }
//   // };

//   const handleCoachClick = (coach) => {
//     navigate(`/coach/${coach._id}`);
//   };

//   const showEditModal = async (coach) => {
//     if (specialities.length === 0) {
//       await fetchSpecialities();
//     }
//     setCurrentCoach(coach);
//     form.setFieldsValue({
//       ...coach,
//       ville: coach.ville || "",
//       speciality: coach.speciality
//         ? coach.speciality.map((speciality) => speciality._id)
//         : [],
//       image: coach.image || "",
//     });
//     setUploadedFileName(coach.image ? coach.image.split("/").pop() : "");
//     setImageUrl(coach.image || "");
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setCurrentCoach(null);
//     form.resetFields();
//     setUploadedFileName("");
//     setImageUrl("");
//     setFileList([]);
//   };

//   const handleDelete = async (coachId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("No token found, please login first");
//         return;
//       }

//       await axios.delete(`https://gokosports.fr/coaches/${coachId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setCoaches(coaches.filter((coach) => coach._id !== coachId));
//       message.success("Coach deleted successfully");
//     } catch (error) {
//       console.error("Error deleting coach:", error);
//       message.error("Failed to delete coach");
//     }
//   };

//   const handleFinish = async (values) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("No token found, please login first");
//         return;
//       }

//       const data = {
//         ...values,
//         speciality: values.speciality,
//       };

//       if (currentCoach) {
//         const response = await axios.put(
//           `https://gokosports.fr/coaches/${currentCoach._id}`,
//           data,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setCoaches(
//           coaches.map((coach) =>
//             coach._id === currentCoach._id
//               ? { ...coach, ...response.data }
//               : coach
//           )
//         );
//         message.success("Coach updated successfully");
//       } else {
//         const response = await axios.post(
//           "https://gokosports.fr/coaches",
//           data,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setCoaches([...coaches, response.data]);
//         message.success("Coach created successfully");
//       }
//       handleCancel();
//     } catch (error) {
//       console.error("Error saving coach:", error);
//       message.error("Failed to save coach");
//     }
//   };

//   const handleAssign = async (values) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("No token found, please login first");
//         return;
//       }

//       await axios.post(
//         "https://gokosports.fr/coaches/assign-coaches",
//         {
//           coachIds: selectedCoaches,
//           commercialId: values.commercial,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const updatedCoaches = coaches.map((coach) => {
//         if (selectedCoaches.includes(coach._id)) {
//           return {
//             ...coach,
//             commercial: commercials.find(
//               (com) => com._id === values.commercial
//             ),
//           };
//         }
//         return coach;
//       });
//       setCoaches(updatedCoaches);
//       message.success("Coaches assigned to commercial successfully");
//       setIsAssignModalVisible(false);
//       setSelectedCoaches([]);
//     } catch (error) {
//       console.error("Error assigning coaches:", error);
//       message.error("Failed to assign coaches");
//     }
//   };

//   const handleUnassign = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("No token found, please login first");
//         return;
//       }

//       await axios.post(
//         "https://gokosports.fr/coaches/unassign-coaches",
//         {
//           coachIds: selectedCoaches,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const updatedCoaches = coaches.map((coach) => {
//         if (selectedCoaches.includes(coach._id)) {
//           return {
//             ...coach,
//             commercial: null,
//           };
//         }
//         return coach;
//       });
//       setCoaches(updatedCoaches);
//       message.success("Coaches unassigned from commercial successfully");
//       setIsUnassignModalVisible(false);
//       setSelectedCoaches([]);
//     } catch (error) {
//       console.error("Error unassigning coaches:", error);
//       message.error("Failed to unassign coaches");
//     }
//   };

//   const handleUploadChange = ({ fileList }) => {
//     setFileList(fileList);
//     if (fileList.length > 0 && fileList[0].status === "done") {
//       const imageUrl = fileList[0].response.secure_url;
//       form.setFieldsValue({ image: imageUrl });
//       setUploadedFileName(fileList[0].name);
//       setImageUrl(imageUrl);
//       setUploading(false);
//       message.success(`${fileList[0].name} file uploaded successfully`);
//     } else if (fileList.length > 0 && fileList[0].status === "error") {
//       console.error("Upload error:", fileList[0].error, fileList[0].response);
//       message.error(`${fileList[0].name} file upload failed.`);
//       setUploading(false);
//     }
//   };

//   const handleTableChange = (pagination) => {
//     setPagination(pagination);
//   };

//   const rowSelection = {
//     onChange: (selectedRowKeys) => {
//       setSelectedCoaches(selectedRowKeys);
//     },
//     selectedRowKeys: selectedCoaches,
//   };

//   const uploadProps = {
//     name: "file",
//     action: "https://api.cloudinary.com/v1_1/doagzivng/image/upload",
//     data: {
//       upload_preset: "kj1jodbh",
//     },
//     fileList,
//     onChange: handleUploadChange,
//   };

//   const columns = [
//     {
//       title: "Raison Sociale",
//       dataIndex: "raisonsociale",
//       key: "raisonsociale",
//       render: (text, record) => (
//         <div
//           className="cursor-pointer"
//           onClick={() => handleCoachClick(record)}
//         >
//           {text}
//         </div>
//       ),
//     },
//     {
//       title: "Coach",
//       dataIndex: "coach",
//       key: "coach",
//       render: (text, record) => (
//         <div
//           className="flex items-center cursor-pointer"
//           onClick={() => handleCoachClick(record)}
//         >
//           <span
//             href={`/coach/${record._id}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="cursor-pointer"
//           >
//             {record.prenom} {record.nom}
//           </span>
//         </div>
//       ),
//     },
//     {
//       title: "Téléphone",
//       dataIndex: "phone",
//       key: "phone",
//       render: (text, record) => (
//         <div
//           className="cursor-pointer"
//           onClick={() => handleCoachClick(record)}
//         >
//           <div>{text}</div>

//           {filterType === "hors_planning" && record.comment && (
//             <div style={{ fontSize: "12px", color: "blue", marginTop: "4px" }}>
//               {record.comment}
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       render: (text, record) => (
//         <div
//           className="cursor-pointer"
//           onClick={() => handleCoachClick(record)}
//         >
//           <div> {text}</div>
//           {filterType === "hors_planning" && record.callSituations && (
//             <div style={{ fontSize: "12px", color: "red", marginTop: "4px" }}>
//               {/* Display call situations as a comma-separated list */}
//               {record.callSituations.join(", ")}
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Code Postal",
//       dataIndex: "codepostal",
//       key: "codepostal",
//       render: (text, record) => (
//         <div
//           className="cursor-pointer"
//           onClick={() => handleCoachClick(record)}
//         >
//           {text}
//         </div>
//       ),
//     },
//     {
//       title: "SIRET",
//       dataIndex: "siret",
//       key: "siret",
//       render: (text, record) => (
//         <div
//           className="cursor-pointer"
//           onClick={() => handleCoachClick(record)}
//         >
//           {text}
//         </div>
//       ),
//     },
//     {
//       title: "Ville",
//       dataIndex: "ville",
//       key: "ville",
//       render: (text, record) => (
//         <div
//           className="cursor-pointer"
//           onClick={() => handleCoachClick(record)}
//         >
//           {text}
//         </div>
//       ),
//     },

//     {
//       title: "Adresse",
//       dataIndex: "adresse",
//       key: "adresse",
//       render: (text, record) => (
//         <div
//           className="cursor-pointer"
//           onClick={() => handleCoachClick(record)}
//         >
//           {text}
//         </div>
//       ),
//     },
//     {
//       title: "Commentaire",
//       dataIndex: "planningData", // Data key for planning data
//       key: "planningData",
//       render: (planningData) => (
//         <div style={{ fontSize: "12px", marginTop: "4px", color: "red" }}>
//           {planningData && planningData.length > 0 ? (
//             planningData.map((planning, index) => (
//               <div key={index}>
//                 {planning.callSituation ? (
//                   <div>{planning.callSituation}</div>
//                 ) : (
//                   <div></div>
//                 )}
//                 {/* {planning.comment ? (
//                   <div>{planning.comment}</div>
//                 ) : (
//                   <div></div>
//                 )} */}
//               </div>
//             ))
//           ) : (
//             <span></span> // Display message if no planning data
//           )}
//         </div>
//       ),
//     },

//     {
//       title: "Commercial",
//       key: "commercial",
//       render: (text, record) => (
//         <div
//           className="cursor-pointer"
//           onClick={() => handleCoachClick(record)}
//         >
//           {record.commercial
//             ? `${record.commercial.prenom} ${record.commercial.nom}`
//             : "N/A"}
//         </div>
//       ),
//     },
//     {
//       title: <span style={{ fontSize: "12px" }}>Action</span>,
//       key: "action",
//       render: (text, record) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             style={{ backgroundColor: "green", color: "white" }}
//             onClick={() => showEditModal(record)}
//             size="small"
//           />
//           <Popconfirm
//             title="Are you sure you want to delete this coach?"
//             onConfirm={() => handleDelete(record._id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button
//               icon={<DeleteOutlined />}
//               style={{ backgroundColor: "red", color: "white" }}
//               danger
//               size="small"
//             />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4">
//       <Breadcrumb>
//         <Breadcrumb.Item>
//           <Link to="/">Tableau de Bord</Link>
//         </Breadcrumb.Item>
//         <Breadcrumb.Item>Coachs</Breadcrumb.Item>
//         <Breadcrumb.Item>Liste des Coachs</Breadcrumb.Item>
//       </Breadcrumb>
//       <h1 className="text-xl font-bold mb-4">Liste des Coachs</h1>
//       <div className="flex justify-between mb-4">
//         <div className="flex flex-col md:flex-row justify-between mb-4">
//           <div className="space-x-2">
//             {clientTypes?.map((type) => (
//               <Button
//                 key={type.value}
//                 type={filterType === type.value ? "primary" : "default"}
//                 onClick={() => handleFilterClick(type.value)}
//               >
//                 {type.label}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="flex items-center mr-auto mb-4">
//         {searchQuery && showCount && (
//           <div className="results-count font-bold text-gray-700 mt-4">
//             {filteredData.length > 0
//               ? `${filteredData.length} coach${
//                   filteredData.length > 1 ? "" : ""
//                 } trouvés`
//               : "No coaches found"}
//           </div>
//         )}
//         {/* <Input
//           type="text"
//           placeholder="Rechercher..."
//           prefix={<SearchOutlined />}
//           className="w-48"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyUp={handleKeyPress}
//         /> */}
//         {[
//           "Prospect_vrg",
//           "client_actif",
//           "prospect_vr",
//           "hors_planning",
//         ].includes(filterType) && (
//           <Input
//             type="text"
//             placeholder="Rechercher..."
//             prefix={<SearchOutlined />}
//             className="w-48"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyUp={handleKeyPress}
//           />
//         )}
//       </div>
//       <div className="w-full p-2">
//         {filterType === "all" && (
//           <Table
//             loading={loading}
//             // columns={columns}
//             columns={[
//               ...columns.map((col) => ({
//                 ...col,
//                 title: (
//                   <div className="flex flex-col items-center">
//                     <div className="text-xs">{col.title}</div>
//                     {col.key !== "action" &&
//                       col.key !== "commercial" &&
//                       col.key !== "planningData" && (
//                         <Input
//                           placeholder={`${col.title}`}
//                           onChange={(e) => handleColumnSearch(e, col.key)}
//                           className="mt-2"
//                           size="medium"
//                           style={{ width: "120%" }}
//                           placeholderStyle={{ fontSize: "2px" }}
//                         />
//                       )}
//                   </div>
//                 ),
//               })),
//             ]}
//             dataSource={searchQuery.trim() ? filteredData : allCoaches}
//             rowKey="_id"
//             scroll={{ x: 600 }}
//             rowSelection={rowSelection}
//             pagination={{
//               current: pagination.current,
//               pageSize: pagination.pageSize,
//               total: pagination.total,
//               onChange: (page, pageSize) => {
//                 if (searchQuery) {
//                   setPagination((prev) => ({
//                     ...prev,
//                     current: page,
//                     pageSize,
//                   }));
//                 } else {
//                   fetchData();
//                 }
//               },
//             }}
//             onChange={handleTableChange}
//             onRow={(record) => ({
//               onContextMenu: (event) => {
//                 event.preventDefault(); // Prevent the default right-click behavior

//                 // Construct a link for the user to open in a new tab
//                 const link = `/coach/${record._id}`;

//                 // Create a custom context menu
//                 const contextMenu = document.createElement("div");
//                 contextMenu.style.position = "absolute";
//                 contextMenu.style.left = `${event.pageX}px`;
//                 contextMenu.style.top = `${event.pageY}px`;
//                 contextMenu.style.backgroundColor = "#fff";
//                 contextMenu.style.border = "1px solid #ccc";
//                 contextMenu.style.padding = "6px";
//                 contextMenu.style.zIndex = "1000";
//                 contextMenu.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"; // Add shadow for better visibility
//                 contextMenu.style.borderRadius = "5px"; // Rounded corners for a cleaner look
//                 contextMenu.style.width = "250px";

//                 // Option 1: Open in new tab
//                 const openInNewTabOption = document.createElement("a");
//                 openInNewTabOption.href = link;
//                 openInNewTabOption.target = "_blank";
//                 openInNewTabOption.innerText = "Ouvrir dans un nouvel onglet";
//                 openInNewTabOption.style.display = "block"; // Display each option as a block (on a new line)
//                 openInNewTabOption.style.padding = "5px 0"; // Add padding for better spacing

//                 // Option 2: Open in new window
//                 const openInNewWindowOption = document.createElement("a");
//                 openInNewWindowOption.href = link;
//                 openInNewWindowOption.target = "_blank";
//                 openInNewWindowOption.onclick = (e) => {
//                   e.preventDefault();
//                   window.open(link, "_blank", "width=900,height=600");
//                 };
//                 openInNewWindowOption.innerText =
//                   "Ouvrir dans une nouvelle fenêtre";
//                 openInNewWindowOption.style.display = "block"; // Display each option as a block
//                 openInNewWindowOption.style.padding = "8px 0"; // Add padding for better spacing

//                 // Option 3: Open in private window (instructions for the user)
//                 const openInPrivateOption = document.createElement("a");
//                 openInPrivateOption.href = "#";

//                 openInPrivateOption.style.color = "#f00"; // Change color to red for emphasis
//                 openInPrivateOption.style.fontStyle = "italic"; // Italic text for instructions
//                 openInPrivateOption.style.display = "block"; // Display each option as a block
//                 openInPrivateOption.style.padding = "8px 0"; // Add padding for better spacing
//                 openInPrivateOption.onclick = (e) => {
//                   e.preventDefault();
//                   alert("");
//                 };

//                 // Append all options to the context menu
//                 contextMenu.appendChild(openInNewTabOption);
//                 contextMenu.appendChild(openInNewWindowOption);
//                 contextMenu.appendChild(openInPrivateOption);

//                 // Append context menu to the body
//                 document.body.appendChild(contextMenu);

//                 // Close the menu when clicked outside
//                 const removeMenu = () => {
//                   document.body.removeChild(contextMenu);
//                   document.removeEventListener("click", removeMenu);
//                 };
//                 document.addEventListener("click", removeMenu);
//               },
//             })}
//             tableLayout="fixed"
//           />
//         )}

//         {filterType === "Prospect_vrg" && (
//           <Table
//             onChange={handleTableChange}
//             columns={columns}
//             loading={loading}
//             // dataSource={prospectCoachesVRG.map((coach) => ({
//             //   ...coach,
//             //   key: coach._id,
//             // }))}
//             dataSource={
//               prospectCoachesVRG.length
//                 ? prospectCoachesVRG.map((coach) => ({
//                     ...coach,
//                     key: coach._id,
//                   }))
//                 : []
//             }
//             pagination={{
//               current: pagination.current,
//               pageSize: pagination.pageSize,
//               total: prospectCoachesVRG.length,
//               onChange: (page, pageSize) => {
//                 setPagination({ current: page, pageSize });
//               },
//             }}
//             rowSelection={rowSelection}
//             // onRow={(record) => ({
//             //   onContextMenu: (event) => {
//             //     event.preventDefault();
//             //     // Only prevent the default right-click behavior to allow "Open link in new tab"
//             //     // Construct a link for the user to select in the context menu
//             //     const link = document.createElement("a");
//             //     link.href = `/coach/${record._id}`;
//             //     link.target = "_blank";
//             //     document.body.appendChild(link);
//             //     link.click();
//             //     document.body.removeChild(link);
//             //   },
//             // })}
//             onRow={(record) => ({
//               onContextMenu: (event) => {
//                 event.preventDefault(); // Prevent the default right-click behavior

//                 // Construct a link for the user to open in a new tab
//                 const link = `/coach/${record._id}`;

//                 // Create a custom context menu
//                 const contextMenu = document.createElement("div");
//                 contextMenu.style.position = "absolute";
//                 contextMenu.style.left = `${event.pageX}px`;
//                 contextMenu.style.top = `${event.pageY}px`;
//                 contextMenu.style.backgroundColor = "#fff";
//                 contextMenu.style.border = "1px solid #ccc";
//                 contextMenu.style.padding = "6px";
//                 contextMenu.style.zIndex = "1000";
//                 contextMenu.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"; // Add shadow for better visibility
//                 contextMenu.style.borderRadius = "5px"; // Rounded corners for a cleaner look
//                 contextMenu.style.width = "250px"; // Set a fixed width for better control

//                 // Option 1: Open in new tab
//                 const openInNewTabOption = document.createElement("a");
//                 openInNewTabOption.href = link;
//                 openInNewTabOption.target = "_blank";
//                 openInNewTabOption.innerText = "Ouvrir dans un nouvel onglet";
//                 openInNewTabOption.style.display = "block"; // Display each option as a block (on a new line)
//                 openInNewTabOption.style.padding = "5px 0"; // Add padding for better spacing

//                 // Option 2: Open in new window
//                 const openInNewWindowOption = document.createElement("a");
//                 openInNewWindowOption.href = link;
//                 openInNewWindowOption.target = "_blank";
//                 openInNewWindowOption.onclick = (e) => {
//                   e.preventDefault();
//                   window.open(link, "_blank", "width=900,height=600");
//                 };
//                 openInNewWindowOption.innerText =
//                   "Ouvrir dans une nouvelle fenêtre";
//                 openInNewWindowOption.style.display = "block"; // Display each option as a block
//                 openInNewWindowOption.style.padding = "8px 0"; // Add padding for better spacing

//                 // Option 3: Open in private window (instructions for the user)
//                 const openInPrivateOption = document.createElement("a");
//                 openInPrivateOption.href = "#";

//                 openInPrivateOption.style.color = "#f00"; // Change color to red for emphasis
//                 openInPrivateOption.style.fontStyle = "italic"; // Italic text for instructions
//                 openInPrivateOption.style.display = "block"; // Display each option as a block
//                 openInPrivateOption.style.padding = "8px 0"; // Add padding for better spacing
//                 openInPrivateOption.onclick = (e) => {
//                   e.preventDefault();
//                   alert(
//                     "To open in private mode, use your browser's incognito/private browsing feature."
//                   );
//                 };

//                 // Append all options to the context menu
//                 contextMenu.appendChild(openInNewTabOption);
//                 contextMenu.appendChild(openInNewWindowOption);
//                 contextMenu.appendChild(openInPrivateOption);

//                 // Append context menu to the body
//                 document.body.appendChild(contextMenu);

//                 // Close the menu when clicked outside
//                 const removeMenu = () => {
//                   document.body.removeChild(contextMenu);
//                   document.removeEventListener("click", removeMenu);
//                 };
//                 document.addEventListener("click", removeMenu);
//               },
//             })}
//             tableLayout="fixed"
//           />
//         )}

//         {filterType === "client_actif" && (
//           <Table
//             loading={loading}
//             onChange={handleTableChange}
//             rowSelection={rowSelection}
//             columns={columns}
//             className="cursor-pointer"
//             dataSource={activeCoaches.map((coach) => ({
//               ...coach,
//               key: coach._id,
//             }))}
//             pagination={{
//               current: pagination.current,
//               pageSize: pagination.pageSize,
//               total: activeCoaches.length,
//               onChange: (page, pageSize) => {
//                 setPagination({ current: page, pageSize });
//               },
//             }}
//             onRow={(record) => ({
//               onContextMenu: (event) => {
//                 event.preventDefault(); // Prevent the default right-click behavior

//                 // Construct a link for the user to open in a new tab
//                 const link = `/coach/${record._id}`;

//                 // Create a custom context menu
//                 const contextMenu = document.createElement("div");
//                 contextMenu.style.position = "absolute";
//                 contextMenu.style.left = `${event.pageX}px`;
//                 contextMenu.style.top = `${event.pageY}px`;
//                 contextMenu.style.backgroundColor = "#fff";
//                 contextMenu.style.border = "1px solid #ccc";
//                 contextMenu.style.padding = "6px";
//                 contextMenu.style.zIndex = "1000";
//                 contextMenu.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"; // Add shadow for better visibility
//                 contextMenu.style.borderRadius = "5px"; // Rounded corners for a cleaner look
//                 contextMenu.style.width = "250px"; // Set a fixed width for better control

//                 // Option 1: Open in new tab
//                 const openInNewTabOption = document.createElement("a");
//                 openInNewTabOption.href = link;
//                 openInNewTabOption.target = "_blank";
//                 openInNewTabOption.innerText = "Ouvrir dans un nouvel onglet";
//                 openInNewTabOption.style.display = "block"; // Display each option as a block (on a new line)
//                 openInNewTabOption.style.padding = "5px 0"; // Add padding for better spacing

//                 // Option 2: Open in new window
//                 const openInNewWindowOption = document.createElement("a");
//                 openInNewWindowOption.href = link;
//                 openInNewWindowOption.target = "_blank";
//                 openInNewWindowOption.onclick = (e) => {
//                   e.preventDefault();
//                   window.open(link, "_blank", "width=900,height=600");
//                 };
//                 openInNewWindowOption.innerText =
//                   "Ouvrir dans une nouvelle fenêtre";
//                 openInNewWindowOption.style.display = "block"; // Display each option as a block
//                 openInNewWindowOption.style.padding = "8px 0"; // Add padding for better spacing

//                 // Option 3: Open in private window (instructions for the user)
//                 const openInPrivateOption = document.createElement("a");
//                 openInPrivateOption.href = "#";

//                 openInPrivateOption.style.color = "#f00"; // Change color to red for emphasis
//                 openInPrivateOption.style.fontStyle = "italic"; // Italic text for instructions
//                 openInPrivateOption.style.display = "block"; // Display each option as a block
//                 openInPrivateOption.style.padding = "8px 0"; // Add padding for better spacing
//                 openInPrivateOption.onclick = (e) => {
//                   e.preventDefault();
//                   alert(
//                     "To open in private mode, use your browser's incognito/private browsing feature."
//                   );
//                 };

//                 // Append all options to the context menu
//                 contextMenu.appendChild(openInNewTabOption);
//                 contextMenu.appendChild(openInNewWindowOption);
//                 contextMenu.appendChild(openInPrivateOption);

//                 // Append context menu to the body
//                 document.body.appendChild(contextMenu);

//                 // Close the menu when clicked outside
//                 const removeMenu = () => {
//                   document.body.removeChild(contextMenu);
//                   document.removeEventListener("click", removeMenu);
//                 };
//                 document.addEventListener("click", removeMenu);
//               },
//             })}
//             tableLayout="fixed"
//           />
//         )}
//         {filterType === "prospect_vr" && (
//           <Table
//             loading={loading}
//             columns={columns}
//             dataSource={prospectCoaches.map((coach) => ({
//               ...coach,
//               key: coach._id,
//             }))}
//             pagination={{
//               current: pagination.current,
//               pageSize: pagination.pageSize,
//               total: prospectCoaches.length,
//               onChange: (page, pageSize) => {
//                 setPagination({ current: page, pageSize });
//               },
//             }}
//             onRow={(record) => ({
//               onContextMenu: (event) => {
//                 event.preventDefault(); // Prevent the default right-click behavior

//                 // Construct a link for the user to open in a new tab
//                 const link = `/coach/${record._id}`;

//                 // Create a custom context menu
//                 const contextMenu = document.createElement("div");
//                 contextMenu.style.position = "absolute";
//                 contextMenu.style.left = `${event.pageX}px`;
//                 contextMenu.style.top = `${event.pageY}px`;
//                 contextMenu.style.backgroundColor = "#fff";
//                 contextMenu.style.border = "1px solid #ccc";
//                 contextMenu.style.padding = "6px";
//                 contextMenu.style.zIndex = "1000";
//                 contextMenu.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"; // Add shadow for better visibility
//                 contextMenu.style.borderRadius = "5px"; // Rounded corners for a cleaner look
//                 contextMenu.style.width = "250px"; // Set a fixed width for better control

//                 // Option 1: Open in new tab
//                 const openInNewTabOption = document.createElement("a");
//                 openInNewTabOption.href = link;
//                 openInNewTabOption.target = "_blank";
//                 openInNewTabOption.innerText = "Ouvrir dans un nouvel onglet";
//                 openInNewTabOption.style.display = "block"; // Display each option as a block (on a new line)
//                 openInNewTabOption.style.padding = "5px 0"; // Add padding for better spacing

//                 // Option 2: Open in new window
//                 const openInNewWindowOption = document.createElement("a");
//                 openInNewWindowOption.href = link;
//                 openInNewWindowOption.target = "_blank";
//                 openInNewWindowOption.onclick = (e) => {
//                   e.preventDefault();
//                   window.open(link, "_blank", "width=900,height=600");
//                 };
//                 openInNewWindowOption.innerText =
//                   "Ouvrir dans une nouvelle fenêtre";
//                 openInNewWindowOption.style.display = "block"; // Display each option as a block
//                 openInNewWindowOption.style.padding = "8px 0"; // Add padding for better spacing

//                 // Option 3: Open in private window (instructions for the user)
//                 const openInPrivateOption = document.createElement("a");
//                 openInPrivateOption.href = "#";

//                 openInPrivateOption.style.color = "#f00"; // Change color to red for emphasis
//                 openInPrivateOption.style.fontStyle = "italic"; // Italic text for instructions
//                 openInPrivateOption.style.display = "block"; // Display each option as a block
//                 openInPrivateOption.style.padding = "8px 0"; // Add padding for better spacing
//                 openInPrivateOption.onclick = (e) => {
//                   e.preventDefault();
//                   alert(
//                     "To open in private mode, use your browser's incognito/private browsing feature."
//                   );
//                 };

//                 // Append all options to the context menu
//                 contextMenu.appendChild(openInNewTabOption);
//                 contextMenu.appendChild(openInNewWindowOption);
//                 contextMenu.appendChild(openInPrivateOption);

//                 // Append context menu to the body
//                 document.body.appendChild(contextMenu);

//                 // Close the menu when clicked outside
//                 const removeMenu = () => {
//                   document.body.removeChild(contextMenu);
//                   document.removeEventListener("click", removeMenu);
//                 };
//                 document.addEventListener("click", removeMenu);
//               },
//             })}
//             tableLayout="fixed"
//           />
//         )}

//         {filterType === "hors_planning" && (
//           <Table
//             loading={loading}
//             onChange={handleTableChange}
//             columns={columns}
//             dataSource={filteredCoaches.map((coach) => ({
//               ...coach,
//               key: coach._id,
//             }))}
//             pagination={{
//               current: pagination.current,
//               pageSize: pagination.pageSize,
//               total: filteredCoaches.length, // Make sure to update this
//               onChange: (page, pageSize) => {
//                 setPagination({ current: page, pageSize });
//               },
//             }}
//             onRow={(record) => ({
//               onContextMenu: (event) => {
//                 event.preventDefault(); // Prevent the default right-click behavior

//                 // Construct a link for the user to open in a new tab
//                 const link = `/coach/${record._id}`;

//                 // Create a custom context menu
//                 const contextMenu = document.createElement("div");
//                 contextMenu.style.position = "absolute";
//                 contextMenu.style.left = `${event.pageX}px`;
//                 contextMenu.style.top = `${event.pageY}px`;
//                 contextMenu.style.backgroundColor = "#fff";
//                 contextMenu.style.border = "1px solid #ccc";
//                 contextMenu.style.padding = "6px";
//                 contextMenu.style.zIndex = "1000";
//                 contextMenu.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"; // Add shadow for better visibility
//                 contextMenu.style.borderRadius = "5px"; // Rounded corners for a cleaner look
//                 contextMenu.style.width = "250px"; // Set a fixed width for better control

//                 // Option 1: Open in new tab
//                 const openInNewTabOption = document.createElement("a");
//                 openInNewTabOption.href = link;
//                 openInNewTabOption.target = "_blank";
//                 openInNewTabOption.innerText = "Ouvrir dans un nouvel onglet";
//                 openInNewTabOption.style.display = "block"; // Display each option as a block (on a new line)
//                 openInNewTabOption.style.padding = "5px 0"; // Add padding for better spacing

//                 // Option 2: Open in new window
//                 const openInNewWindowOption = document.createElement("a");
//                 openInNewWindowOption.href = link;
//                 openInNewWindowOption.target = "_blank";
//                 openInNewWindowOption.onclick = (e) => {
//                   e.preventDefault();
//                   window.open(link, "_blank", "width=900,height=600");
//                 };
//                 openInNewWindowOption.innerText =
//                   "Ouvrir dans une nouvelle fenêtre";
//                 openInNewWindowOption.style.display = "block"; // Display each option as a block
//                 openInNewWindowOption.style.padding = "8px 0"; // Add padding for better spacing

//                 // Option 3: Open in private window (instructions for the user)
//                 const openInPrivateOption = document.createElement("a");
//                 openInPrivateOption.href = "#";

//                 openInPrivateOption.style.color = "#f00"; // Change color to red for emphasis
//                 openInPrivateOption.style.fontStyle = "italic"; // Italic text for instructions
//                 openInPrivateOption.style.display = "block"; // Display each option as a block
//                 openInPrivateOption.style.padding = "8px 0"; // Add padding for better spacing
//                 openInPrivateOption.onclick = (e) => {
//                   e.preventDefault();
//                   alert(
//                     "To open in private mode, use your browser's incognito/private browsing feature."
//                   );
//                 };

//                 // Append all options to the context menu
//                 contextMenu.appendChild(openInNewTabOption);
//                 contextMenu.appendChild(openInNewWindowOption);
//                 contextMenu.appendChild(openInPrivateOption);

//                 // Append context menu to the body
//                 document.body.appendChild(contextMenu);

//                 // Close the menu when clicked outside
//                 const removeMenu = () => {
//                   document.body.removeChild(contextMenu);
//                   document.removeEventListener("click", removeMenu);
//                 };
//                 document.addEventListener("click", removeMenu);
//               },
//             })}
//             tableLayout="fixed"
//           />
//         )}
//         <Modal
//           // className="fixed-modal"
//           title={currentCoach ? "Modifier Coach" : "Ajouter Coach"}
//           visible={isModalVisible}
//           onCancel={handleCancel}
//           footer={null}
//           width={500}
//           centered
//           className="fixed-modal rounded-lg shadow-lg  bg-white"
//         >
//           <Form form={form} layout="vertical" onFinish={handleFinish}>
//             <div className="grid grid-cols-2 overflow-y-auto p-4 max-h-96 gap-2">
//               <Form.Item
//                 name="prenom"
//                 label="Prénom"
//                 rules={[
//                   { required: false, message: "Veuillez entrer le prénom" },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 name="nom"
//                 label="Nom"
//                 rules={[{ required: false, message: "Veuillez entrer le nom" }]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 name="email"
//                 label="Email"
//                 rules={[
//                   { required: false, message: "Veuillez entrer l'email" },
//                 ]}
//               >
//                 <Input type="email" />
//               </Form.Item>
//               <Form.Item
//                 name="phone"
//                 label="Téléphone"
//                 rules={[
//                   { required: false, message: "Veuillez entrer le téléphone" },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 name="age"
//                 label="Âge"
//                 rules={[{ required: false, message: "Veuillez entrer l'âge" }]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 name="sex"
//                 label="Sexe"
//                 rules={[
//                   { required: false, message: "Veuillez sélectionner le sexe" },
//                 ]}
//               >
//                 <Select>
//                   <Option value="homme">Homme</Option>
//                   <Option value="femme">Femme</Option>
//                 </Select>
//               </Form.Item>
//               <Form.Item
//                 name="ville"
//                 label="Ville"
//                 rules={[
//                   { required: false, message: "Veuillez entrer la ville" },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 name="siret"
//                 label="Siret"
//                 rules={[
//                   { required: false, message: "Veuillez entrer le siret" },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 name="raisonsociale"
//                 label="Raison sociale"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Veuillez entrer la raison sociale",
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 name="adresse"
//                 label="Adresse"
//                 rules={[
//                   { required: false, message: "Veuillez entrer l'adresse" },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 name="codepostal"
//                 label="Code postal"
//                 rules={[
//                   {
//                     required: false,
//                     message: "Veuillez entrer le code postal",
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 name="speciality"
//                 label="Spécialité"
//                 rules={[
//                   {
//                     required: false,
//                     message: "Veuillez sélectionner la spécialité",
//                   },
//                 ]}
//               >
//                 <Select
//                   mode="multiple"
//                   showSearch
//                   optionFilterProp="children"
//                   allowClear
//                 >
//                   {specialities.map((speciality) => (
//                     <Option key={speciality._id} value={speciality._id}>
//                       {speciality.nom}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//               <Form.Item label="Image">
//                 <Upload {...uploadProps}>
//                   <Button icon={<UploadOutlined />} loading={uploading}>
//                     Télécharger
//                   </Button>
//                 </Upload>
//               </Form.Item>
//               {uploadedFileName && (
//                 <Form.Item>
//                   <div className="flex items-center mt-2">
//                     <Avatar
//                       src={imageUrl}
//                       alt="Uploaded Image"
//                       size={50}
//                       className="mr-2"
//                     />
//                     <span>{uploadedFileName}</span>
//                     <Button
//                       type="link"
//                       icon={<DeleteOutlined />}
//                       onClick={() => {
//                         form.setFieldsValue({ image: "" });
//                         setUploadedFileName("");
//                         setImageUrl("");
//                       }}
//                     />
//                   </div>
//                 </Form.Item>
//               )}
//             </div>
//             <Form.Item className="mt-2">
//               <Button type="primary" htmlType="submit">
//                 {currentCoach
//                   ? "Enregistrer les modifications"
//                   : "Ajouter Coach"}
//               </Button>
//               <Button onClick={handleCancel} className="ml-2">
//                 Annuler
//               </Button>
//             </Form.Item>
//           </Form>
//         </Modal>
//         <Modal
//           title="Affecter les Coachs au Commercial"
//           visible={isAssignModalVisible}
//           onCancel={() => setIsAssignModalVisible(false)}
//           footer={null}
//         >
//           <Form form={assignForm} onFinish={handleAssign}>
//             <Form.Item
//               name="commercial"
//               label="Commercial"
//               rules={[
//                 {
//                   required: true,
//                   message: "Veuillez sélectionner un commercial",
//                 },
//               ]}
//             >
//               <Select placeholder="Sélectionnez un commercial">
//                 {commercials.map((commercial) => (
//                   <Option key={commercial._id} value={commercial._id}>
//                     {commercial.nom} {commercial.prenom}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//             <Form.Item>
//               <Button type="primary" htmlType="submit">
//                 Affecter
//               </Button>
//               <Button
//                 onClick={() => setIsAssignModalVisible(false)}
//                 className="ml-2"
//               >
//                 Annuler
//               </Button>
//             </Form.Item>
//           </Form>
//         </Modal>
//         <Modal
//           title="Désaffecter les Coachs du Commercial"
//           visible={isUnassignModalVisible}
//           onCancel={() => setIsUnassignModalVisible(false)}
//           footer={null}
//         >
//           <Form form={unassignForm} onFinish={handleUnassign}>
//             <Form.Item>
//               <Button type="primary" htmlType="submit">
//                 Désaffecter
//               </Button>
//               <Button
//                 onClick={() => setIsUnassignModalVisible(false)}
//                 className="ml-2"
//               >
//                 Annuler
//               </Button>
//             </Form.Item>
//           </Form>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default CoachList;
