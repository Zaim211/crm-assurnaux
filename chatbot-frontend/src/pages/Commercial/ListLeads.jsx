import React, { useState, useEffect } from "react";
import { Table, Select, message, Spin, Input } from "antd";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "tailwindcss/tailwind.css";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ListLeads = () => {
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commercials, setCommercials] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleColumnSearch = async (e, columnKey) => {
    const value = e.target.value.toLowerCase().trim();
    setSearchQuery(value);

    try {
      // If search value is empty, show all data
      if (value === "") {
        setFilteredData(chatData);
        return;
      }

      // If searching on 'commercial', handle 'N/A' or empty value cases
      if (columnKey === "commercial") {
        const filteredData = chatData.filter((item) => {
          const commercialValue = item[columnKey]
            ? `${item[columnKey].prenom} ${item[columnKey].nom}`.toLowerCase()
            : "n/a"; // Set 'n/a' as default if commercial is empty or null

          return commercialValue.includes(value);
        });
        setFilteredData(filteredData);
        return;
      }

      // Default search (for other fields)
      const response = await axios.get("/search", {
        params: {
          query: value,
          columnKey: columnKey,
        },
      });
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error in search:", error);
      message.error("Error while searching.");
    }
  };

  const handlePageChange = (value) => {
    setCurrentPage(value);
  };
  const totalPages = Math.ceil(chatData.length / pageSize);

  const fetchCoaches = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token); // Decode token to get user details
    const userId = decodedToken?.userId; // Extract user ID
    const userName = decodedToken?.name; // Extract full name

    try {
      setLoading(true);

      // Fetch leads from backend
      const response = await axios.get("/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response data:", response.data); // Debug response structure

      // Ensure `allLeads` is an array
      const allLeads = response.data?.chatData || [];
      console.log("All leads:", allLeads); // Debug all leads

      // Split user's full name into first and last names
      const nameParts = userName?.trim().split(" ") || [];
      const firstName = nameParts[1] || ""; // First name
      const lastName = nameParts[0] || ""; // Last name

      // Filter leads based on the current commercial's info
      const filteredLeads = allLeads.filter((lead) => {
        const commercial = lead.commercial || {}; // Ensure commercial exists
        return (
          commercial._id === userId && // Match ID
          commercial.nom === lastName && // Match last name
          commercial.prenom === firstName // Match first name
        );
      });
      console.log("Filtered leads:", filteredLeads); // Debug filtered leads

      setChatData(filteredLeads); // Update state with filtered leads
    } catch (error) {
      console.error("Error fetching leads:", error);
      message.error("Failed to fetch leads");
    } finally {
      setLoading(false); // End loading state
    }
  };

  useEffect(() => {
    fetchCommercials();
    fetchCoaches();
  }, []);

  const fetchCommercials = async () => {
    try {
      const response = await axios.get("/commercials");
      setCommercials(response.data);
      console.log("Fetched commercials:", response.data);
    } catch (error) {
      console.error("Error fetching commercials:", error);
      message.error("Failed to fetch commercials");
    }
  };

  const handleLeadClick = (chatData) => {
    navigate(`/lead/${chatData._id}`);
  };
  const handleStatusLeadChange = async (statusLead, record) => {
    try {
      const validStatuses = ["nouveau", "prospect", "client"];
      if (statusLead === "all") {
        statusLead = "nouveau"; // Treat 'all' as 'nouveau'
      }
      if (!validStatuses.includes(statusLead)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      const response = await axios.put(`/updateStatusLead/${record._id}`, {
        statusLead, // Ensure you're passing the statusLead in the body
      });
      console.log("Updated status:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading && showSpinner) return <Spin tip="Loading..." />;

  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  const columns = [
    {
      title: "Prénom et Nom", // Changed title to "Prenom and Nom"
      key: "nom",
      dataIndex: "nom",
      render: (text, record) => (
        <div className="cursor-pointer" onClick={() => handleLeadClick(record)}>
          <div>{record.nom || ""}</div>
        </div>
      ),
    },

    {
      title: "Email",
      key: "email" || "email1",
      dataIndex: "email" || "email1",
      render: (text, record) => (
        <div className="cursor-pointer" onClick={() => handleLeadClick(record)}>
          <div className="text-gray-500 text-xs">
            {record.verification_email === "Non" ? record.email1 : record.email}
          </div>
        </div>
      ),
    },
    // {
    //   title: "DATE",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (date) => {
    //     if (!date) return "-";
    //     const formattedDate = new Date(date);
    //     const day = formattedDate.toLocaleDateString("en-GB");
    //     const time = formattedDate.toLocaleTimeString("en-US", {
    //       hour: "2-digit",
    //       minute: "2-digit",
    //     });
    //     return (
    //       <div
    //         className="cursor-pointer"
    //         onClick={() => handleLeadClick(record)}
    //       >
    //         <div>{day}</div>
    //         <div className="text-gray-500 text-sm">{time}</div>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "TELEPHONE",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => text || "",
    },
    {
      title: "code postal",
      dataIndex: "codepostal",
      key: "codepostal",
      render: (text) => text || "",
    },
    {
      title: "Ville",
      dataIndex: "ville",
      key: "ville",
      render: (text) => text || "",
    },

    {
      title: "Siret",
      dataIndex: "siret",
      key: "siret",
      render: (text, record) => text || record.siret || "",
    },
  
    {
      title: "STATUS LEAD",
      key: "type",
      dataIndex: "type",
    },

    {
      title: "Commentaire",
      key: "lastComment",
      render: (text, record) => {
        const lastComment = record.commentaires?.[record.commentaires.length - 1];
        if (!lastComment) return <span className="text-gray-400 text-xs">Aucun commentaire</span>;
        const date = new Date(lastComment.addedAt).toLocaleDateString("fr-FR");
        const time = new Date(lastComment.addedAt).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
    
        return (
          <div className="text-xs">
            <div className="font-semibold text-gray-800">{lastComment.text}</div>
            <div className="text-gray-500">{lastComment.addedBy.name}</div>
            <div className="text-gray-400">{date} à {time}</div>
          </div>
        );
      },
    },
    {
      title: "commercial",
      key: "commercial",
      dataIndex: "commercial",
      render: (text, record) => (
        <div>
          {record.commercial
            ? `${record.commercial.prenom} ${record.commercial.nom}`
            : "N/A"}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">List des Leads</h1>

      <div className="mb-4 p-4 flex items-center rounded-md gap-4">
        <span className="font-thin text-gray-600">Afficher</span>
        <Select
          defaultValue={1}
          onChange={handlePageChange}
          className="w-20 border-gray-300"
        >
          {[...Array(totalPages)].map((_, index) => (
            <Option key={index + 1} value={index + 1}>
              {index + 1}
            </Option>
          ))}
        </Select>

        <span className="font-thin text-gray-600">résultats par page</span>
      </div>
      <div className="bg-white rounded-lg shadow-md w-full md:p-6 overflow-x-auto">
        <Table
          columns={[
            ...columns.map((col) => ({
              ...col,
              title: (
                <div className="flex flex-col items-center">
                  <div className="text-xs">{col.title}</div>
                  {col.key !== "action" && (
                    <Input
                      placeholder={`${col.title}`}
                      onChange={(e) => handleColumnSearch(e, col.key)}
                      // className="mt-2 text-sm sm:text-base w-full sm:w-auto"
                      size="medium"
                    />
                  )}
                </div>
              ),
            })),
          ]}
          dataSource={chatData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          pagination={{
            current: currentPage,
            pageSize,
            total: chatData.length,
            onChange: (page) => setCurrentPage(page),
          }}
          rowKey={(record) => record._id}
          bordered
          className="custom-table text-xs sm:text-sm"
          tableLayout="auto"
        />
      </div>
    </div>
  );
};

export default ListLeads;
