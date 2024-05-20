"use client";
import { UserDTO } from "@/lib/backend-client";
import {
  getTextColorFromBackground,
  stringToColor,
} from "@/lib/master/helpers";
import { EventContentArg } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Box, CircularProgress, styled } from "@mui/material";
import Link from "next/link";
import React from "react";
import NextLink from "../NextLink";

export type CalendarEvent = {
  type: string;
  params: any[];
  start: Date;
  end: Date;
  uid: string;
  dtstamp: Date;
  lastmodified: Date;
  summary: string;
  location: string;
  description: string;
};

export type CalendarEventData = {
  [key: string]: CalendarEvent;
};

const parseICS = (icsData: CalendarEventData) => {
  return Object.values(icsData).map((event) => {
    return {
      title: event.summary,
      start: new Date(event.start),
      end: new Date(event.end),
      description: event.description,
      location: event.location,
    };
  });
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const courseCode = eventInfo.event.title.split(",").at(0);
  const color = courseCode ? stringToColor(courseCode) : "initial";
  return (
    <Box
      sx={{
        backgroundColor: color,
        outline: `3px solid ${color}`,
        boxShadow: `1px 1px 1px 2px ${getTextColorFromBackground(color)}`,
        color: getTextColorFromBackground(color),
        outlineOffset: "-1px",
        borderRadius: "1px",
        padding: "1px 1px 0px",
        width: "100%",
        height: "100%",
        fontSize: "1em",
        overflow: "hidden",
      }}
      title={`
${eventInfo.event.title}

${eventInfo.event.extendedProps.description}

${eventInfo.event.extendedProps.location}
        `}
    >
      <b>{eventInfo.timeText}</b>
      <br />
      <span>{eventInfo.event.title}</span>
      {eventInfo.event.extendedProps.location && (
        <div><NextLink sx={{textDecoration: "underline"}} target="_blank" href={`/room/${eventInfo.event.extendedProps.location.replace("Lokal: ", "").replace("/", "%2F")}`}>{eventInfo.event.extendedProps.location}</NextLink></div>
      )}
    </Box>
  );
};

const StyledFullCalendarContainer = styled(Box)`
  height: 90%;
  width: 100%;

  .fc {
    width: 100%;
    height: 95%;
  }
`;

export const CalendarComponent = ({ user }: { user: UserDTO | undefined }) => {
  const [icsData, setIcsData] = React.useState();
  const [teProxyURL, setTeProxyURL] = React.useState();
  const [hasLoaded, setHasLoaded] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      fetch("/api/mycalendar").then((data) =>
        data.json().then((data) => {
          setIcsData(data.data);
          setTeProxyURL(data.url);
          setHasLoaded(true);
        }),
      );
    }
  }, [user]);

  if (!user) {
    return <span>Welcome to LiUtils. Sign in to view the calendar of your favorite plan.</span>
  }

  if (!icsData || !teProxyURL) {
    if (!hasLoaded) {
      return <CircularProgress />;
    }
    return (
      <span>
        Could not fetch calendar data. You need to have a favorite plan saved.
      </span>
    );
  }

  return (
    <>
      <StyledFullCalendarContainer>
        <h5>Calendar of {user.name}&apos;s favorite plan:</h5>
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          weekends={false}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          slotMinTime="08:00"
          events={parseICS(icsData)}
          eventContent={renderEventContent}
        />
      </StyledFullCalendarContainer>
      <Box
        sx={{
          width: "100%",
          height: "5%",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          paddingBottom: 5,
        }}
      >
        <Link target="_blank" rel="no-referrer" href={teProxyURL}>
          TimeEdit HTML
        </Link>
        <Link target="_blank" rel="no-referrer" href={`${teProxyURL}.ics`}>
          TimeEdit ICS
        </Link>
      </Box>
    </>
  );
};
