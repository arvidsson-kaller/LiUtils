"use client";
import {
  getTextColorFromBackground,
  stringToColor,
} from "@/lib/master/helpers";
import { EventContentArg } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Box, styled } from "@mui/material";
import Link from "next/link";

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
        <div>{eventInfo.event.extendedProps.location}</div>
      )}
    </Box>
  );
};

const StyledFullCalendarContainer = styled(Box)`
  height: 90%;

  .fc {
    min-width: 50vw;
    height: 100%;
  }
`;

export const CalendarComponent = ({
  icsData,
  teProxyURL,
}: {
  icsData: CalendarEventData;
  teProxyURL: string;
}) => {
  return (
    <>
      <StyledFullCalendarContainer>
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
          minWidth: "50vw",
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
