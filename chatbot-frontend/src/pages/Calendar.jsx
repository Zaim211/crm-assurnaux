// import React, { useState, useEffect } from "react";
// import { Calendar, Modal } from "antd";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import moment from "moment";

// const MyCalendar = () => {
//   const [selectedEvents, setSelectedEvents] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [events, setEvents] = useState([]);
//   const token = localStorage.getItem("token");
//   const decodedUser = token ? jwtDecode(token) : "";
//   const userLoged = decodedUser.userId;

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get(`events/${userLoged}`);
//       console.log("API Response:", response); // Debug log
      
//       // Corrected data access - use response.data.data if your backend nests data this way
//       const eventsData = Array.isArray(response.data) ? response.data : 
//                         Array.isArray(response.data.data) ? response.data.data : [];
      
//       console.log("Events Data:", eventsData); // Debug log

//       const formattedEvents = eventsData.map((event) => ({
//         ...event,
//         color: "#4096ff",
//         formattedTime: formatTime(event.event_time)
//       }));
  
//       setEvents(formattedEvents);
//       console.log("Formatted Events:", formattedEvents); // Debug log
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     }
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     if (timeString.includes('h')) {
//       return timeString.replace('h', ':');
//     }
//     return timeString;
//   };

//   const dateCellRender = (value) => {
//     const dateStr = value.format('YYYY-MM-DD');
    
//     const matchingEvents = events.filter((event) => {
//       const eventDate = moment(event.event_date).format('YYYY-MM-DD');
//       return eventDate === dateStr;
//     });

  
//     return matchingEvents.map((event, index) => (
//       <div key={`${dateStr}-${index}`}>
//         <div
//           className="border rounded px-2 py-1 mb-1 block cursor-pointer"
//           style={{ backgroundColor: event.color || "#4096ff", color: "#ffffff" }}
//           onClick={() => window.location.href = `/lead/${event.lead}`}
//         >
//           {event.formattedTime || event.event_time} - {event.objective}
//         </div>
//       </div>
//     ));
//   };
  
//   const handleSelect = (value) => {
//     const dateStr = value.format('YYYY-MM-DD');
//     const matchingEvents = events.filter((event) => 
//       moment(event.event_date).format('YYYY-MM-DD') === dateStr
//     );
//     setSelectedEvents(matchingEvents);
//     setSelectedDate(value);
//   };

//   return (
//     <div className="w-full mx-auto mt-1 max-w-screen">
//       <h2 className="text-xl font-bold mb-4 text-start">Calendar</h2>
//       <div className="border border-gray-300 rounded-lg p-4 shadow-md h-full">
//         <div className="mb-4">
//           <Calendar
//             className="w-full h-full"
//             style={{ maxWidth: "100%" }}
//             dateCellRender={dateCellRender}
//             fullscreen={true}
//             onSelect={handleSelect}
//           />
//         </div>
//         <Modal
//           title={
//             selectedDate
//               ? `Appointments: ${selectedDate.format("dddd, MMMM D, YYYY")}`
//               : "Appointments"
//           }
//           open={selectedEvents.length > 0}
//           onCancel={() => {
//             setSelectedEvents([]);
//             setSelectedDate(null);
//           }}
//           footer={null}
//         >
//           {selectedEvents.map((event, index) => (
//             <div
//               key={index}
//               className="mb-2 p-2 rounded"
//               style={{
//                 backgroundColor: event.color,
//                 color: "#FFFFFF",
//               }}
//             >
//               <div className="font-semibold">
//                 {event.formattedTime || event.event_time} - {event.objective}
//               </div>
//               <div className="text-sm">{event.comment}</div>
//               <div className="text-xs mt-1">
//                 Lead ID: {event.lead}
//               </div>
//             </div>
//           ))}
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default MyCalendar;
import React, { useState, useEffect } from "react";
import { Calendar, Modal } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

const MyCalendar = () => {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");
  const decodedUser = token ? jwtDecode(token) : "";
  const userLoged = decodedUser.userId;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get('/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response); // Debug log
      const eventData = response?.data;
      const decodedToken = token ? jwtDecode(token) : null;
        const currentUserId = decodedToken?.userId;
      
        const filterecommand = eventData.filter(
          (cmd) => cmd.session === currentUserId
        );
      // Corrected data access - use response.data.data if your backend nests data this way
      const eventsData = Array.isArray(filterecommand) ? filterecommand : 
                        Array.isArray(filterecommand.data) ? filterecommand.data : [];
      
      console.log("Events Data:", eventsData); // Debug log

      const formattedEvents = eventsData.map((event) => ({
        ...event,
        color: "#4096ff",
        formattedTime: formatTime(event.event_time)
      }));
  
      setEvents(formattedEvents);
      console.log("Formatted Events:", formattedEvents); // Debug log
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    if (timeString.includes('h')) {
      return timeString.replace('h', ':');
    }
    return timeString;
  };

  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    console.log(`Checking events for date: ${dateStr}`); // Debug log
    
    const matchingEvents = events.filter((event) => {
      const eventDate = moment(event.event_date).format('YYYY-MM-DD');
      console.log(`Event date: ${eventDate}`); // Debug log
      return eventDate === dateStr;
    });

    console.log(`Found ${matchingEvents.length} events for ${dateStr}`); // Debug log
  
    return matchingEvents.map((event, index) => (
      <div key={`${dateStr}-${index}`}>
        <div
          className="border rounded px-2 py-1 mb-1 block cursor-pointer"
          style={{ backgroundColor: event.color || "#4096ff", color: "#ffffff" }}
          onClick={() => window.location.href = `/lead/${event.lead}`}
        >
          {event.formattedTime || event.event_time} - {event.objective}
        </div>
      </div>
    ));
  };
  
  const handleSelect = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const matchingEvents = events.filter((event) => 
      moment(event.event_date).format('YYYY-MM-DD') === dateStr
    );
    setSelectedEvents(matchingEvents);
    setSelectedDate(value);
  };

  return (
    <div className="w-full mx-auto mt-1 max-w-screen">
      <h2 className="text-xl font-bold mb-4 text-start">Calendar</h2>
      <div className="border border-gray-300 rounded-lg p-4 shadow-md h-full">
        <div className="mb-4">
          <Calendar
            className="w-full h-full"
            style={{ maxWidth: "100%" }}
            dateCellRender={dateCellRender}
            fullscreen={true}
            onSelect={handleSelect}
          />
        </div>
        <Modal
          title={
            selectedDate
              ? `Appointments: ${selectedDate.format("dddd, MMMM D, YYYY")}`
              : "Appointments"
          }
          open={selectedEvents.length > 0}
          onCancel={() => {
            setSelectedEvents([]);
            setSelectedDate(null);
          }}
          footer={null}
        >
          {selectedEvents.map((event, index) => (
            <div
              key={index}
              className="mb-2 p-2 rounded"
              style={{
                backgroundColor: event.color,
                color: "#FFFFFF",
              }}
            >
              <div className="font-semibold">
                {event.formattedTime || event.event_time} - {event.objective}
              </div>
              <div className="text-sm">{event.comment}</div>
              <div className="text-xs mt-1">
                Lead ID: {event.lead}
              </div>
            </div>
          ))}
        </Modal>
      </div>
    </div>
  );
};

export default MyCalendar;