import { Express, Request, Response } from "express";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import path from "path";
import config from "./Helper/config";
//import dbConnect from "../src/Routes";

dotenv.config();
const PORT: string = process.env.PORT || config.port;
const DEPLOYED_URL = process.env.DEPLYED_URL ||  config.deployedUrl

const ErrorObj = {
    type: "object",
    properties: {
        success: {
            type: "boolean",
            description: "Indicates the success or failure of the request",
            example: false
        },
        message: {
            type: "string",
            description: "Error message",
            example: "An error occurred"
        },
        error: {
            type: "string",
            description: "Detailed error message (only in non-production environments)",
            nullable: true,
            example: "Invalid request"
        },
        errorObj: {
            type: "object",
            description: "Detailed error object with additional information",
            properties: {
                code: {
                    type: "string",
                    description: "Error code for reference",
                    example: "INVALID_REQUEST"
                },
                stackTrace: {
                    type: "string",
                    description: "Stack trace (only visible in development)",
                    nullable: true,
                    example: "at /path/to/file.js:23"
                }
            }
        }
    }
};


// Swagger configuration options
const options: any = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Bozu Logs Api",
            description: "user log and admin panel backend api",
            version: "1.0.0",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Local Development Server",
            },
            {
                url: DEPLOYED_URL,
                description: "Hosted Development Server",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT", // Optional
                },
            },
            schemas: {
                AddUserRequestBody: {
                    type: "object",
                    required: ["name", "email", "dob", "isActive"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Nusarat",
                        },
                        email: {
                            type: "string",
                            example: "nusarat@example.com",
                        },
                        dob: {
                            type: "string",
                            format: "date",
                            example: "2002-10-02",
                        },
                        isActive: {
                            type: "boolean",
                            example: true,
                        },
                    },
                },
                AddAdminRequestBody: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Nusarat",
                            description: "The full name of the admin.",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "nusarat@example.com",
                            description: "The email address of the admin.",
                        },
                        password: {
                            type: "string",
                            minLength: 6,
                            example: "password123",
                            description: "The password for the admin account. Must be at least 6 characters long.",
                        },
                    },
                },
                ErrorObjT: ErrorObj,

                EventLog: {
                    type: "object",
                    properties: {
                        eventId: {
                            type: "integer",
                            example: 254,
                        },
                        eventName: {
                            type: "string",
                            example: "Event Test With Peer",
                        },
                        eventNumber: {
                            type: "string",
                            example: "Ok",
                        },
                        eventType: {
                            type: "string",
                            example: "OK",
                        },
                        eventDate: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-27T11:16:50.000Z",
                        },
                        eventStartTime: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-27T11:16:50.000Z",
                        },
                        eventEndTime: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-27T11:17:00.000Z",
                        },
                        _id: {
                            type: "string",
                            example: "679880d055a61ee3ba9ae2b8",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-28T07:01:36.229Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-28T07:01:36.229Z",
                        },
                        __v: {
                            type: "integer",
                            example: 0,
                        },
                    },
                },

                ErrorObj: {
                    type: "object",
                    properties: {
                        data: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "string",
                                    example: "EventLog validation failed: eventDate: Cast to date failed for value \"_________________\" (type string) at path \"eventDate\"",
                                },
                                errorObj: {
                                    type: "object",
                                    additionalProperties: true,
                                },
                            },
                        },
                        message: {
                            type: "string",
                            example: "EventLog validation failed: eventDate: Cast to date failed for value \"_________________\" (type string) at path \"eventDate\"",
                        },
                        statusCode: {
                            type: "integer",
                            example: 400,
                        },
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        isOperationalError: {
                            type: "boolean",
                            example: false,
                        },
                    },
                },
                AddEvent: {
                    type: "object",
                    properties: {
                        eventId: {
                            type: "integer",
                            example: 253,
                        },
                        eventName: {
                            type: "string",
                            example: "Event Test With Peer",
                        },
                        eventNumber: {
                            type: "string",
                            example: "Ok",
                        },
                        eventType: {
                            type: "string",
                            example: "OK",
                        },
                        eventDate: {
                            type: "integer",
                            example: 1737976610000,
                        },
                        eventStartTime: {
                            type: "integer",
                            example: 1737976610000,
                        },
                        eventEndTime: {
                            type: "integer",
                            example: 1737976620000,
                        },
                    },
                },

                EventLogsWithActualTimeAndPaginationInfo: {
                    type: "object",
                    properties: {
                        data: {
                            type: "object",
                            properties: {
                                eventLogsWithActualTime: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/EventLogWithActualTime",
                                    },
                                },
                                paginationInfo: {
                                    type: "object",
                                    properties: {
                                        currentPage: {
                                            type: "integer",
                                            example: 2,
                                        },
                                        totalPages: {
                                            type: "integer",
                                            example: 36,
                                        },
                                        totalEvents: {
                                            type: "integer",
                                            example: 36,
                                        },
                                        limit: {
                                            type: "integer",
                                            example: 1,
                                        },
                                        sortOrder: {
                                            type: "string",
                                            example: "desc",
                                        },
                                    },
                                },
                            },
                        },
                        message: {
                            type: "string",
                            example: "Event logs fetched successfully",
                        },
                        statusCode: {
                            type: "integer",
                            example: 200,
                        },
                        success: {
                            type: "boolean",
                            example: true,
                        },
                        isOperationalError: {
                            type: "boolean",
                            example: false,
                        },
                    },
                },

                EventLogWithActualTime: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "6788ecb382de24dcc9f707ca",
                        },
                        eventId: {
                            type: "integer",
                            example: 96547,
                        },
                        eventName: {
                            type: "string",
                            example: "Patch Test",
                        },
                        eventNumber: {
                            type: "string",
                            example: "Patch",
                        },
                        eventType: {
                            type: "string",
                            example: "Patch",
                        },
                        eventDate: {
                            type: "string",
                            format: "date-time",
                            example: "2056-09-24T09:25:40.000Z",
                        },
                        eventStartTime: {
                            type: "string",
                            format: "date-time",
                            example: "2056-09-24T09:25:40.000Z",
                        },
                        eventEndTime: {
                            type: "string",
                            format: "date-time",
                            example: "2056-09-24T14:12:20.000Z",
                        },
                        __v: {
                            type: "integer",
                            example: 0,
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-16T11:25:39.818Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-16T12:37:26.514Z",
                        },
                        actualTime: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/ActualTime",
                            },
                        },
                    },
                },

                ActualTime: {
                    type: "object",
                    properties: {
                        eventLogId: {
                            type: "string",
                            example: "679882019a3aa2702e6d9387",
                        },
                        eventId: {
                            type: "integer",
                            example: 253,
                        },
                        actualStartTime: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-27T11:10:50.000Z",
                        },
                        actualEndTime: {
                            type: ["string", "null"],
                            format: "date-time",
                            example: null,
                        },
                        _id: {
                            type: "string",
                            example: "6798a89d577f484d28a33f8c",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-28T09:51:25.859Z",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-28T09:51:25.859Z",
                        },
                        __v: {
                            type: "integer",
                            example: 0,
                        },
                    },
                },

                EventLogsResponse: {
                    type: "object",
                    properties: {
                        data: {
                            type: "object",
                            properties: {
                                eventLogs: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "6788ecb382de24dcc9f707ca" },
                                            eventId: { type: "integer", example: 96547 },
                                            eventName: { type: "string", example: "Patch Test" },
                                            eventNumber: { type: "string", example: "Patch" },
                                            eventType: { type: "string", example: "Patch" },
                                            eventDate: { type: "string", format: "date-time", example: "2056-09-24T09:25:40.000Z" },
                                            eventStartTime: { type: "string", format: "date-time", example: "2056-09-24T09:25:40.000Z" },
                                            eventEndTime: { type: "string", format: "date-time", example: "2056-09-24T14:12:20.000Z" },
                                            __v: { type: "integer", example: 0 },
                                            createdAt: { type: "string", format: "date-time", example: "2025-01-16T11:25:39.818Z" },
                                            updatedAt: { type: "string", format: "date-time", example: "2025-01-16T12:37:26.514Z" },
                                        },
                                    },
                                },
                                paginationInfo: {
                                    type: "object",
                                    properties: {
                                        currentPage: { type: "integer", example: 2 },
                                        totalPages: { type: "integer", example: 36 },
                                        totalEvents: { type: "integer", example: 36 },
                                        limit: { type: "integer", example: 1 },
                                        sortOrder: { type: "string", example: "desc" },
                                    },
                                },
                            },
                        },
                        message: { type: "string", example: "Event logs fetched successfully" },
                        statusCode: { type: "integer", example: 200 },
                        success: { type: "boolean", example: true },
                        isOperationalError: { type: "boolean", example: false },
                    },
                },

                peerObject: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "6799ddbd8974e7df4b7a83cf" },
                        eventId: { type: "string", example: "11" },
                        peerId: { type: "string", example: "p122" },
                        peerName: { type: "string", example: "Nusarat 2" },
                        useId: { type: "string", example: "user123" },
                        userEmail: { type: "string", example: "nmv.doe@example.com" },
                        eventJoinDatetime: { type: "string", format: "date-time", example: "2025-01-27T11:13:50.000Z" },
                        eventLeftDatetime: { type: "string", format: "date-time", example: "2025-01-27T11:49:50.000Z" },
                        isHost: { type: "boolean", example: false },
                        ipAddress: { type: "string", example: "103.39.128.135" },
                        userAgent: { type: "string", example: "PostmanRuntime/7.43.0" },
                        city: { type: "string", example: "Vadodara" },
                        state: { type: "string", example: "Gujarat" },
                        country: { type: "string", example: "IN" },
                        latitude: { type: "number", example: 22.2994 },
                        longitude: { type: "number", example: 73.2081 },
                        postalCode: { type: "string", example: "382355" },
                        isp: { type: "string", example: "AS45916 Gujarat Telelink Pvt Ltd" },
                        hasCopiedInvationLink: { type: "boolean", example: false },
                        hasClickedBirdsEyeView: { type: "boolean", example: false },
                        hasClickedlMyGroupView: { type: "boolean", example: true },
                        hasClickedEchoDetection: { type: "boolean", example: true },
                        hasClickedWhiteBoard: { type: "boolean", example: false },
                        hasClickedAnnotationBoard: { type: "boolean", example: true },
                        hasCreatedPoll: { type: "boolean", example: false },
                        hasSwitchedOnMike: { type: "boolean", example: true },
                        hasSwitchedOnCamera: { type: "boolean", example: false },
                        hasSelectedVirtualBackground: { type: "boolean", example: true },
                        hasClikedOnlyGroupCanSeeVideo: { type: "boolean", example: false },
                        hasSwitchedOnScreenShare: { type: "boolean", example: true },
                        hasClikedOnlyGroupCanSeeScreenShare: { type: "boolean", example: false },
                        hasRaisedHand: { type: "boolean", example: false },
                        hasThumbsUp: { type: "boolean", example: true },
                        hasThumbsDown: { type: "boolean", example: false },
                        hasClaped: { type: "boolean", example: true },
                        hasSwitchedOnAnnouncement: { type: "boolean", example: false },
                        hasStartedCc: { type: "boolean", example: true },
                        hasRequestedTranscript: { type: "boolean", example: false },
                        hasRequestedSummary: { type: "boolean", example: true },
                        hasGeneratedActionItems: { type: "boolean", example: true },
                        hasStartedRecording: { type: "boolean", example: false },
                        hasSwitchedOnMuteAll: { type: "boolean", example: false },
                        hasSwitchedOnDisabledAllVideos: { type: "boolean", example: false },
                        hasSwitchedOnLobbyStatus: { type: "boolean", example: true },
                        hasSwitchedOnGroupStatus: { type: "boolean", example: true },
                        hasSwitchedOnGroupLockStatus: { type: "boolean", example: false },
                        hasSwitchedOnPrivateVideoShareStaus: { type: "boolean", example: true },
                        hasSwitchedOnPrivateScreenShareStatus: { type: "boolean", example: false },
                        hasGotMike: { type: "boolean", example: true },
                        isPresenter: { type: "boolean", example: true },
                        isTriviaHost: { type: "boolean", example: false },
                        isStagePeer: { type: "boolean", example: true },
                        isBanFromPublicChat: { type: "boolean", example: false },
                        isKickedout: { type: "boolean", example: false },
                        hasSwitchedListenAll: { type: "boolean", example: false },
                        hasSwithcedHostOnlyListen: { type: "boolean", example: true },
                        isMainHost: { type: "boolean", example: true },
                        hasExportedAttendanceList: { type: "boolean", example: false },
                        admitedPeers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer123" },
                                    peerName: { type: "string", example: "Jane Smith" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:30:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d2" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d2" }
                                }
                            }
                        },
                        rejectedPeers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer456" },
                                    peerName: { type: "string", example: "Mike Johnson" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T11:00:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d3" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d3" }
                                }
                            }
                        },
                        kickedOut: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer789" },
                                    peerName: { type: "string", example: "Alice Brown" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T12:00:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d4" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d4" }
                                }
                            }
                        },
                        switchMadeHost: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer101" },
                                    peerName: { type: "string", example: "Charlie Green" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:15:00.000Z" },
                                    staus: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d5" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d5" }
                                }
                            }
                        },
                        switchBanFromPublicChat: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer202" },
                                    peerName: { type: "string", example: "Emily White" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T11:30:00.000Z" },
                                    status: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d6" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d6" }
                                }
                            }
                        },
                        inviteToGroup: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer303" },
                                    peerName: { type: "string", example: "David Black" },
                                    groupName: { type: "string", example: "Group 1" },
                                    groupId: { type: "string", example: "group123" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:45:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d7" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d7" }
                                }
                            }
                        },
                        joinToGroup: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    groupName: { type: "string", example: "Group 1" },
                                    groupId: { type: "string", example: "group123" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T11:00:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d8" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d8" }
                                }
                            }
                        },
                        madeGroupAnonymous: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    groupName: { type: "string", example: "Group 2" },
                                    groupId: { type: "string", example: "group456" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T11:15:00.000Z" },
                                    status: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d9" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d9" }
                                }
                            }
                        },
                        passedMike: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer404" },
                                    peerName: { type: "string", example: "Olivia Blue" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:00:00.000Z" },
                                    status: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83da" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83da" }
                                }
                            }
                        },
                        inviteOnstage: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer505" },
                                    peerName: { type: "string", example: "William Gray" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T12:30:00.000Z" },
                                    status: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83db" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83db" }
                                }
                            }
                        },
                        createdGroups: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    groupName: { type: "string", example: "Group A" },
                                    groupId: { type: "string", example: "group123" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:30:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83dc" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83dc" }
                                }
                            }
                        },
                        groupLocked: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    groupName: { type: "string", example: "Group A" },
                                    groupId: { type: "string", example: "group123" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:30:00.000Z" },
                                    status: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83dd" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83dd" }
                                }
                            }
                        },
                        groupChat: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    groupName: { type: "string", example: "Group A" },
                                    groupId: { type: "string", example: "group123" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:30:00.000Z" },
                                    type: { type: "string", example: "text" },
                                    fileCount: { type: "integer", example: 2 },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83de" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83de" }
                                }
                            }
                        },
                        publicChat: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:30:00.000Z" },
                                    type: { type: "string", example: "emoji" },
                                    fileCount: { type: "integer", example: 0 },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83df" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83df" }
                                }
                            }
                        },
                        __v: { type: "integer", example: 0 },
                        eventType: {
                            type: "string",
                            example: "OK",
                        },
                        usedShowOnlyMyGroupVideo: {
                            type: "boolean",
                            example: true,
                        }
                        , duration: {
                            type: "string",
                            example: "0h 30m",
                        },
                        id: {
                            type: "string",
                            example: "6799de118974e7df4b7a83df",
                        }
                    }
                },

                addPeerObject: {
                    type: "object",
                    properties: {
                        peerName: { type: "string", example: "Nusarat 2" },
                        useId: { type: "string", example: "user123" },
                        userEmail: { type: "string", example: "nmv.doe@example.com" },
                        eventJoinDatetime: { type: "string", format: "date-time", example: "2025-01-27T11:13:50.000Z" },
                        eventLeftDatetime: { type: "string", format: "date-time", example: "2025-01-27T11:49:50.000Z" },
                        isHost: { type: "boolean", example: false },
                        ipAddress: { type: "string", example: "103.39.128.135" },
                        userAgent: { type: "string", example: "PostmanRuntime/7.43.0" },
                        city: { type: "string", example: "Vadodara" },
                        state: { type: "string", example: "Gujarat" },
                        country: { type: "string", example: "IN" },
                        latitude: { type: "number", example: 22.2994 },
                        longitude: { type: "number", example: 73.2081 },
                        postalCode: { type: "string", example: "382355" },
                        isp: { type: "string", example: "AS45916 Gujarat Telelink Pvt Ltd" },
                        hasCopiedInvationLink: { type: "boolean", example: false },
                        hasClickedBirdsEyeView: { type: "boolean", example: false },
                        hasClickedlMyGroupView: { type: "boolean", example: true },
                        hasClickedEchoDetection: { type: "boolean", example: true },
                        hasClickedWhiteBoard: { type: "boolean", example: false },
                        hasClickedAnnotationBoard: { type: "boolean", example: true },
                        hasCreatedPoll: { type: "boolean", example: false },
                        hasSwitchedOnMike: { type: "boolean", example: true },
                        hasSwitchedOnCamera: { type: "boolean", example: false },
                        hasSelectedVirtualBackground: { type: "boolean", example: true },
                        hasClikedOnlyGroupCanSeeVideo: { type: "boolean", example: false },
                        hasSwitchedOnScreenShare: { type: "boolean", example: true },
                        hasClikedOnlyGroupCanSeeScreenShare: { type: "boolean", example: false },
                        hasRaisedHand: { type: "boolean", example: false },
                        hasThumbsUp: { type: "boolean", example: true },
                        hasThumbsDown: { type: "boolean", example: false },
                        hasClaped: { type: "boolean", example: true },
                        hasSwitchedOnAnnouncement: { type: "boolean", example: false },
                        hasStartedCc: { type: "boolean", example: true },
                        hasRequestedTranscript: { type: "boolean", example: false },
                        hasRequestedSummary: { type: "boolean", example: true },
                        hasGeneratedActionItems: { type: "boolean", example: true },
                        hasStartedRecording: { type: "boolean", example: false },
                        hasSwitchedOnMuteAll: { type: "boolean", example: false },
                        hasSwitchedOnDisabledAllVideos: { type: "boolean", example: false },
                        hasSwitchedOnLobbyStatus: { type: "boolean", example: true },
                        hasSwitchedOnGroupStatus: { type: "boolean", example: true },
                        hasSwitchedOnGroupLockStatus: { type: "boolean", example: false },
                        hasSwitchedOnPrivateVideoShareStaus: { type: "boolean", example: true },
                        hasSwitchedOnPrivateScreenShareStatus: { type: "boolean", example: false },
                        hasGotMike: { type: "boolean", example: true },
                        isPresenter: { type: "boolean", example: true },
                        isTriviaHost: { type: "boolean", example: false },
                        isStagePeer: { type: "boolean", example: true },
                        isBanFromPublicChat: { type: "boolean", example: false },
                        isKickedout: { type: "boolean", example: false },
                        hasSwitchedListenAll: { type: "boolean", example: false },
                        hasSwithcedHostOnlyListen: { type: "boolean", example: true },
                        isMainHost: { type: "boolean", example: true },
                        hasExportedAttendanceList: { type: "boolean", example: false },
                        admitedPeers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer123" },
                                    peerName: { type: "string", example: "Jane Smith" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:30:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d2" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d2" }
                                }
                            }
                        },
                        rejectedPeers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer456" },
                                    peerName: { type: "string", example: "Mike Johnson" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T11:00:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d3" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d3" }
                                }
                            }
                        },
                        kickedOut: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer789" },
                                    peerName: { type: "string", example: "Alice Brown" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T12:00:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d4" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d4" }
                                }
                            }
                        },
                        switchMadeHost: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer101" },
                                    peerName: { type: "string", example: "Charlie Green" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:15:00.000Z" },
                                    staus: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d5" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d5" }
                                }
                            }
                        },
                        switchBanFromPublicChat: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer202" },
                                    peerName: { type: "string", example: "Emily White" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T11:30:00.000Z" },
                                    status: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d6" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d6" }
                                }
                            }
                        },
                        inviteToGroup: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer303" },
                                    peerName: { type: "string", example: "David Black" },
                                    groupName: { type: "string", example: "Group 1" },
                                    groupId: { type: "string", example: "group123" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:45:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d7" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d7" }
                                }
                            }
                        },
                        joinToGroup: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    groupName: { type: "string", example: "Group 1" },
                                    groupId: { type: "string", example: "group123" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T11:00:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d8" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d8" }
                                }
                            }
                        },
                        madeGroupAnonymous: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    groupName: { type: "string", example: "Group 2" },
                                    groupId: { type: "string", example: "group456" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T11:15:00.000Z" },
                                    status: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83d9" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83d9" }
                                }
                            }
                        },
                        passedMike: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer404" },
                                    peerName: { type: "string", example: "Olivia Blue" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:00:00.000Z" },
                                    status: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83da" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83da" }
                                }
                            }
                        },
                        inviteOnstage: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    peerId: { type: "string", example: "peer505" },
                                    peerName: { type: "string", example: "William Gray" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T12:30:00.000Z" },
                                    status: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83db" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83db" }
                                }
                            }
                        },
                        createdGroups: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    groupName: { type: "string", example: "Group A" },
                                    groupId: { type: "string", example: "group123" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:30:00.000Z" },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83dc" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83dc" }
                                }
                            }
                        },
                        groupLocked: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    groupName: { type: "string", example: "Group A" },
                                    groupId: { type: "string", example: "group123" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:30:00.000Z" },
                                    status: { type: "boolean", example: true },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83dd" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83dd" }
                                }
                            }
                        },
                        groupChat: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    groupName: { type: "string", example: "Group A" },
                                    groupId: { type: "string", example: "group123" },
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:30:00.000Z" },
                                    type: { type: "string", example: "text" },
                                    fileCount: { type: "integer", example: 2 },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83de" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83de" }
                                }
                            }
                        },
                        publicChat: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    date: { type: "string", format: "date-time", example: "2025-01-24T10:30:00.000Z" },
                                    type: { type: "string", example: "emoji" },
                                    fileCount: { type: "integer", example: 0 },
                                    _id: { type: "string", example: "6799de118974e7df4b7a83df" },
                                    id: { type: "string", example: "6799de118974e7df4b7a83df" }
                                }
                            }
                        },
                        __v: { type: "integer", example: 0 },
                        eventType: {
                            type: "string",
                            example: "OK",
                        },
                        usedShowOnlyMyGroupVideo: {
                            type: "boolean",
                            example: true,
                        }
                    }
                },

                UserLoginLog: {
                    type: "object",
                    properties: {
                        userId: { type: "integer", example: 123 },
                        username: { type: "string", example: "nusarat_haveliwala" },
                        name: { type: "string", example: "Nusarat Haveliwala" },
                        deviceSource: { type: "string", example: "Web" },
                        ipAddress: { type: "string", example: "192.168.1.1" },
                        loginStatus: { type: "boolean", example: true },
                        logoutStatus: { type: "boolean", example: false },
                        endTime: { type: "string", format: "date-time", example: null },
                        city: { type: "string", example: null },
                        state: { type: "string", example: null },
                        country: { type: "string", example: null },
                        latitude: { type: "number", example: null },
                        longitude: { type: "number", example: null },
                        postalCode: { type: "string", example: null },
                        userAgent: { type: "string", example: null },
                        isp: { type: "string", example: null },
                        _id: { type: "string", example: "679a34b0a159f69e957b90e0" },
                        startTime: { type: "string", format: "date-time", example: "2025-01-29T14:01:20.705Z" },
                        __v: { type: "integer", example: 0 }
                    }
                },

                AddUserLoginLog: {
                    type: "object",
                    properties: {
                        userId: { type: "integer", example: 123 },
                        username: { type: "string", example: "nusarat_haveliwala" },
                        name: { type: "string", example: "Nusarat Haveliwala" },
                        deviceSource: { type: "string", example: "Web" },
                        ipAddress: { type: "string", example: "192.168.1.1" },
                        city: { type: "string", example: null },
                        state: { type: "string", example: null },
                        country: { type: "string", example: null },
                        latitude: { type: "number", example: null },
                        longitude: { type: "number", example: null },
                        postalCode: { type: "string", example: null },
                        userAgent: { type: "string", example: null },
                        isp: { type: "string", example: null },
                        startTime: { type: "string", format: "date-time", example: "2025-01-29T14:01:20.705Z" },
                    }
                },

                AdminObject: {
                    type: "object",
                    properties: {
                        addedAdmin: {
                            type: "object",
                            properties: {
                                password: {
                                    type: "string",
                                    example: "$2a$10$RjjCbuv1YhIYpX7BdW1sAOShzCOa0joJHWAkKAlhDZA7TKOZW4IG6",
                                    description: "Hashed password of the admin"
                                },
                                adminName: {
                                    type: "string", 
                                    example: "test",
                                    description: "Name of the admin"
                                },
                                adminEmail: {
                                    type: "string",
                                    format: "email",
                                    example: "testfb@bozu.us",
                                    description: "Email address of the admin"
                                },
                                role: {
                                    type: "string",
                                    enum: ["SUPERADMIN", "ADMIN"],
                                    example: "SUPERADMIN",
                                    description: "Role of the admin user"
                                },
                                _id: {
                                    type: "string",
                                    example: "679afe16dd26149ee6aec91d",
                                    description: "Unique identifier for the admin"
                                },
                                __v: {
                                    type: "integer",
                                    example: 0,
                                    description: "Version key"
                                }
                            }
                        }
                    }
                },
                AdminUpdated: {
                    type: "object",
                    properties: {
                        updatedAdmin: {
                            type: "object",
                            properties: {
                                password: {
                                    type: "string",
                                    example: "$2a$10$RjjCbuv1YhIYpX7BdW1sAOShzCOa0joJHWAkKAlhDZA7TKOZW4IG6",
                                    description: "Hashed password of the admin"
                                },
                                adminName: {
                                    type: "string", 
                                    example: "test",
                                    description: "Name of the admin"
                                },
                                adminEmail: {
                                    type: "string",
                                    format: "email",
                                    example: "testfb@bozu.us",
                                    description: "Email address of the admin"
                                },
                                role: {
                                    type: "string",
                                    enum: ["SUPERADMIN", "ADMIN"],
                                    example: "SUPERADMIN",
                                    description: "Role of the admin user"
                                },
                                _id: {
                                    type: "string",
                                    example: "679afe16dd26149ee6aec91d",
                                    description: "Unique identifier for the admin"
                                },
                                __v: {
                                    type: "integer",
                                    example: 0,
                                    description: "Version key"
                                }
                            }
                        }
                    }
                },

                EventLogsWithPeersResponse: {
                    type: "object",
                    properties: {
                        data: {
                            type: "object",
                            properties: {
                                eventLogsWithPeers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "679882019a3aa2702e6d9387" },
                                            eventId: { type: "integer", example: 253 },
                                            eventName: { type: "string", example: "Event Test Whgjghjith Peer" },
                                            eventNumber: { type: "string", example: "Ok" },
                                            eventType: { type: "string", example: "hgdfhgfh" },
                                            eventDate: { type: "string", format: "date-time", example: "2056-10-05T13:03:30.000Z" },
                                            eventStartTime: { type: "string", format: "date-time", example: "2056-10-05T13:03:30.000Z" },
                                            eventEndTime: { type: "string", format: "date-time", example: "2056-10-05T13:03:40.000Z" },
                                            createdAt: { type: "string", format: "date-time", example: "2025-01-28T07:06:41.125Z" },
                                            updatedAt: { type: "string", format: "date-time", example: "2025-01-28T09:29:32.304Z" },
                                            __v: { type: "integer", example: 0 },
                                            actualTimesWithPeers: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        actualTime: {
                                                            type: "object",
                                                            properties: {
                                                                _id: { type: "string", example: "6798a89d577f484d28a33f8c" },
                                                                eventLogId: { type: "string", example: "679882019a3aa2702e6d9387" },
                                                                eventId: { type: "integer", example: 253 },
                                                                actualStartTime: { type: "string", format: "date-time", example: "2025-01-27T11:10:50.000Z" },
                                                                actualEndTime: { type: "string", format: "date-time", nullable: true, example: null },
                                                                createdAt: { type: "string", format: "date-time", example: "2025-01-28T09:51:25.859Z" },
                                                                updatedAt: { type: "string", format: "date-time", example: "2025-01-28T09:51:25.859Z" },
                                                                __v: { type: "integer", example: 0 }
                                                            }
                                                        },
                                                        eventInstanceInfo: {
                                                            type: "object",
                                                            properties: {
                                                                totalAttendance: { type: "integer", example: 0 },
                                                                totalHost: { type: "integer", example: 0 },
                                                                totalKickout: { type: "integer", example: 0 },
                                                                totalRaisedHand: { type: "integer", example: 0 },
                                                                totalThumbsup: { type: "integer", example: 0 },
                                                                totalThumbsdown: { type: "integer", example: 0 },
                                                                totalClaps: { type: "integer", example: 0 },
                                                                totalEchoInstances: { type: "integer", example: 0 },
                                                                totalRecordingClicks: { type: "integer", example: 0 },
                                                                totalCCClicks: { type: "integer", example: 0 },
                                                                totalTranscriptRequests: { type: "integer", example: 0 },
                                                                totalSummaryRequests: { type: "integer", example: 0 },
                                                                totalActionItemsGenerated: { type: "integer", example: 0 },
                                                                totalBirdsEyeViewClick: { type: "integer", example: 0 },
                                                                totalMyGroupViewClicked: { type: "integer", example: 0 },
                                                                totalScreenShares: { type: "integer", example: 0 },
                                                                totalCameraTurnOn: { type: "integer", example: 0 },
                                                                totalMicTurnOn: { type: "integer", example: 0 },
                                                                totalGroupsCreated: { type: "integer", example: 0 },
                                                                totalLocksGroup: { type: "integer", example: 0 },
                                                                totalUnlocksGroup: { type: "integer", example: 0 },
                                                                totalEventLinksCopied: { type: "integer", example: 0 },
                                                                totalMuteAllClickedSwitched: { type: "integer", example: 0 },
                                                                totalDisabledAllVideoSwitch: { type: "integer", example: 0 },
                                                                totalDisabledAllScrennShareSwitch: { type: "integer", example: 0 },
                                                                totalLobbyStatusSwitch: { type: "integer", example: 0 },
                                                                totalGroupAllowStatusSwitch: { type: "integer", example: 0 },
                                                                totalGrouplockStatusSwitch: { type: "integer", example: 0 },
                                                                totalPrivateVideoShareSwitch: { type: "integer", example: 0 },
                                                                totalPrivateScreenShareSwitch: { type: "integer", example: 0 },
                                                                totalWhiteBoardClicked: { type: "integer", example: 0 },
                                                                totalAnnotationBoardClicked: { type: "integer", example: 0 },
                                                                totalPollCreated: { type: "integer", example: 0 },
                                                                totalAnnouncementModeClicked: { type: "integer", example: 0 }
                                                            }
                                                        },
                                                        peers: {
                                                            type: "array",
                                                            items: {
                                                                $ref: "#/components/schemas/peerObject"
                                                            },
                                                            description: "Array of peer objects"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                paginationInfo: {
                                    type: "object",
                                    properties: {
                                        currentPage: { type: "integer", example: 1 },
                                        totalPages: { type: "integer", example: 4 },
                                        totalEvents: { type: "integer", example: 38 },
                                        limit: { type: "integer", example: 10 },
                                        sortOrder: { type: "string", example: "desc" }
                                    }
                                }
                            }
                        },
                        message: { type: "string", example: "Event logs with peers fetched successfully" },
                        statusCode: { type: "integer", example: 200 },
                        success: { type: "boolean", example: true },
                        isOperationalError: { type: "boolean", example: false }
                    }
                },

                EventLogsWithEventInstanceResponse: {
                    type: "object",
                    properties: {
                        data: {
                            type: "object",
                            properties: {
                                eventLogs: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "679882019a3aa2702e6d9387" },
                                            eventId: { type: "integer", example: 253 },
                                            eventName: { type: "string", example: "Event Test Whgjghjith Peer" },
                                            eventNumber: { type: "string", example: "Ok" },
                                            eventType: { type: "string", example: "hgdfhgfh" },
                                            eventDate: { type: "string", format: "date-time", example: "2056-10-05T13:03:30.000Z" },
                                            eventStartTime: { type: "string", format: "date-time", example: "2056-10-05T13:03:30.000Z" },
                                            eventEndTime: { type: "string", format: "date-time", example: "2056-10-05T13:03:40.000Z" },
                                            createdAt: { type: "string", format: "date-time", example: "2025-01-28T07:06:41.125Z" },
                                            updatedAt: { type: "string", format: "date-time", example: "2025-01-28T09:29:32.304Z" },
                                            __v: { type: "integer", example: 0 },
                                            actualTimesWithEventInstance: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        actualTime: {
                                                            type: "object",
                                                            properties: {
                                                                _id: { type: "string", example: "6798a89d577f484d28a33f8c" },
                                                                eventLogId: { type: "string", example: "679882019a3aa2702e6d9387" },
                                                                eventId: { type: "integer", example: 253 },
                                                                actualStartTime: { type: "string", format: "date-time", example: "2025-01-27T11:10:50.000Z" },
                                                                actualEndTime: { type: ["string", "null"], format: "date-time", example: null },
                                                                createdAt: { type: "string", format: "date-time", example: "2025-01-28T09:51:25.859Z" },
                                                                updatedAt: { type: "string", format: "date-time", example: "2025-01-28T09:51:25.859Z" },
                                                                __v: { type: "integer", example: 0 }
                                                            }
                                                        },
                                                        eventInstanceInfo: {
                                                            type: "object",
                                                            properties: {
                                                                totalAttendance: { type: "integer", example: 0 },
                                                                totalHost: { type: "integer", example: 0 },
                                                                totalKickout: { type: "integer", example: 0 },
                                                                totalRaisedHand: { type: "integer", example: 0 },
                                                                totalThumbsup: { type: "integer", example: 0 },
                                                                totalThumbsdown: { type: "integer", example: 0 },
                                                                totalClaps: { type: "integer", example: 0 },
                                                                totalEchoInstances: { type: "integer", example: 0 },
                                                                totalRecordingClicks: { type: "integer", example: 0 },
                                                                totalCCClicks: { type: "integer", example: 0 },
                                                                totalTranscriptRequests: { type: "integer", example: 0 },
                                                                totalSummaryRequests: { type: "integer", example: 0 },
                                                                totalActionItemsGenerated: { type: "integer", example: 0 },
                                                                totalBirdsEyeViewClick: { type: "integer", example: 0 },
                                                                totalMyGroupViewClicked: { type: "integer", example: 0 },
                                                                totalScreenShares: { type: "integer", example: 0 },
                                                                totalCameraTurnOn: { type: "integer", example: 0 },
                                                                totalMicTurnOn: { type: "integer", example: 0 },
                                                                totalGroupsCreated: { type: "integer", example: 0 },
                                                                totalLocksGroup: { type: "integer", example: 0 },
                                                                totalUnlocksGroup: { type: "integer", example: 0 },
                                                                totalEventLinksCopied: { type: "integer", example: 0 },
                                                                totalMuteAllClickedSwitched: { type: "integer", example: 0 },
                                                                totalDisabledAllVideoSwitch: { type: "integer", example: 0 },
                                                                totalDisabledAllScrennShareSwitch: { type: "integer", example: 0 },
                                                                totalLobbyStatusSwitch: { type: "integer", example: 0 },
                                                                totalGroupAllowStatusSwitch: { type: "integer", example: 0 },
                                                                totalGrouplockStatusSwitch: { type: "integer", example: 0 },
                                                                totalPrivateVideoShareSwitch: { type: "integer", example: 0 },
                                                                totalPrivateScreenShareSwitch: { type: "integer", example: 0 },
                                                                totalWhiteBoardClicked: { type: "integer", example: 0 },
                                                                totalAnnotationBoardClicked: { type: "integer", example: 0 },
                                                                totalPollCreated: { type: "integer", example: 0 },
                                                                totalAnnouncementModeClicked: { type: "integer", example: 0 }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                paginationInfo: {
                                    type: "object",
                                    properties: {
                                        currentPage: { type: "integer", example: 1 },
                                        totalPages: { type: "integer", example: 4 },
                                        totalEvents: { type: "integer", example: 38 },
                                        limit: { type: "integer", example: 10 },
                                        sortOrder: { type: "string", example: "desc" }
                                    }
                                }
                            }
                        },
                        message: { type: "string", example: "Event logs with event instance fetched successfully" },
                        statusCode: { type: "integer", example: 201 },
                        success: { type: "boolean", example: true },
                        isOperationalError: { type: "boolean", example: false }
                    }
                },

                EventLogsWithEventInstanceSearchResponse: {
                    type: "object",
                    properties: {
                        data: {
                            type: "object",
                            properties: {
                                eventLogs: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "679882019a3aa2702e6d9387" },
                                            eventId: { type: "integer", example: 253 },
                                            eventName: { type: "string", example: "Event Test Whgjghjith Peer" },
                                            eventNumber: { type: "string", example: "Ok" },
                                            eventType: { type: "string", example: "hgdfhgfh" },
                                            eventDate: { type: "string", format: "date-time", example: "2056-10-05T13:03:30.000Z" },
                                            eventStartTime: { type: "string", format: "date-time", example: "2056-10-05T13:03:30.000Z" },
                                            eventEndTime: { type: "string", format: "date-time", example: "2056-10-05T13:03:40.000Z" },
                                            createdAt: { type: "string", format: "date-time", example: "2025-01-28T07:06:41.125Z" },
                                            updatedAt: { type: "string", format: "date-time", example: "2025-01-28T09:29:32.304Z" },
                                            __v: { type: "integer", example: 0 },
                                            actualTimesWithEventInstance: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        actualTime: {
                                                            type: "object",
                                                            properties: {
                                                                _id: { type: "string", example: "6798a89d577f484d28a33f8c" },
                                                                eventLogId: { type: "string", example: "679882019a3aa2702e6d9387" },
                                                                eventId: { type: "integer", example: 253 },
                                                                actualStartTime: { type: "string", format: "date-time", example: "2025-01-27T11:10:50.000Z" },
                                                                actualEndTime: { type: ["string", "null"], format: "date-time", example: null },
                                                                createdAt: { type: "string", format: "date-time", example: "2025-01-28T09:51:25.859Z" },
                                                                updatedAt: { type: "string", format: "date-time", example: "2025-01-28T09:51:25.859Z" },
                                                                __v: { type: "integer", example: 0 }
                                                            }
                                                        },
                                                        eventInstanceInfo: {
                                                            type: "object",
                                                            properties: {
                                                                totalAttendance: { type: "integer", example: 0 },
                                                                totalHost: { type: "integer", example: 0 },
                                                                totalKickout: { type: "integer", example: 0 },
                                                                totalRaisedHand: { type: "integer", example: 0 },
                                                                totalThumbsup: { type: "integer", example: 0 },
                                                                totalThumbsdown: { type: "integer", example: 0 },
                                                                totalClaps: { type: "integer", example: 0 },
                                                                totalEchoInstances: { type: "integer", example: 0 },
                                                                totalRecordingClicks: { type: "integer", example: 0 },
                                                                totalCCClicks: { type: "integer", example: 0 },
                                                                totalTranscriptRequests: { type: "integer", example: 0 },
                                                                totalSummaryRequests: { type: "integer", example: 0 },
                                                                totalActionItemsGenerated: { type: "integer", example: 0 },
                                                                totalBirdsEyeViewClick: { type: "integer", example: 0 },
                                                                totalMyGroupViewClicked: { type: "integer", example: 0 },
                                                                totalScreenShares: { type: "integer", example: 0 },
                                                                totalCameraTurnOn: { type: "integer", example: 0 },
                                                                totalMicTurnOn: { type: "integer", example: 0 },
                                                                totalGroupsCreated: { type: "integer", example: 0 },
                                                                totalLocksGroup: { type: "integer", example: 0 },
                                                                totalUnlocksGroup: { type: "integer", example: 0 },
                                                                totalEventLinksCopied: { type: "integer", example: 0 },
                                                                totalMuteAllClickedSwitched: { type: "integer", example: 0 },
                                                                totalDisabledAllVideoSwitch: { type: "integer", example: 0 },
                                                                totalDisabledAllScrennShareSwitch: { type: "integer", example: 0 },
                                                                totalLobbyStatusSwitch: { type: "integer", example: 0 },
                                                                totalGroupAllowStatusSwitch: { type: "integer", example: 0 },
                                                                totalGrouplockStatusSwitch: { type: "integer", example: 0 },
                                                                totalPrivateVideoShareSwitch: { type: "integer", example: 0 },
                                                                totalPrivateScreenShareSwitch: { type: "integer", example: 0 },
                                                                totalWhiteBoardClicked: { type: "integer", example: 0 },
                                                                totalAnnotationBoardClicked: { type: "integer", example: 0 },
                                                                totalPollCreated: { type: "integer", example: 0 },
                                                                totalAnnouncementModeClicked: { type: "integer", example: 0 }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                totalCount: {
                                    type: "integer",
                                    example: 10 
                                }
                            }
                        },
                        message: { type: "string", example: "Event fetched successfully" },
                        statusCode: { type: "integer", example: 201 },
                        success: { type: "boolean", example: true },
                        isOperationalError: { type: "boolean", example: false }
                    }
                },

                EventLogsSearchWithPeersResponse: {
                    type: "object",
                    properties: {
                        data: {
                            type: "object",
                            properties: {
                                eventLogsWithPeers: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "679882019a3aa2702e6d9387" },
                                            eventId: { type: "integer", example: 253 },
                                            eventName: { type: "string", example: "Event Test Whgjghjith Peer" },
                                            eventNumber: { type: "string", example: "Ok" },
                                            eventType: { type: "string", example: "hgdfhgfh" },
                                            eventDate: { type: "string", format: "date-time", example: "2056-10-05T13:03:30.000Z" },
                                            eventStartTime: { type: "string", format: "date-time", example: "2056-10-05T13:03:30.000Z" },
                                            eventEndTime: { type: "string", format: "date-time", example: "2056-10-05T13:03:40.000Z" },
                                            createdAt: { type: "string", format: "date-time", example: "2025-01-28T07:06:41.125Z" },
                                            updatedAt: { type: "string", format: "date-time", example: "2025-01-28T09:29:32.304Z" },
                                            __v: { type: "integer", example: 0 },
                                            actualTimesWithPeers: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        actualTime: {
                                                            type: "object",
                                                            properties: {
                                                                _id: { type: "string", example: "6798a89d577f484d28a33f8c" },
                                                                eventLogId: { type: "string", example: "679882019a3aa2702e6d9387" },
                                                                eventId: { type: "integer", example: 253 },
                                                                actualStartTime: { type: "string", format: "date-time", example: "2025-01-27T11:10:50.000Z" },
                                                                actualEndTime: { type: "string", format: "date-time", nullable: true, example: null },
                                                                createdAt: { type: "string", format: "date-time", example: "2025-01-28T09:51:25.859Z" },
                                                                updatedAt: { type: "string", format: "date-time", example: "2025-01-28T09:51:25.859Z" },
                                                                __v: { type: "integer", example: 0 }
                                                            }
                                                        },
                                                        eventInstanceInfo: {
                                                            type: "object",
                                                            properties: {
                                                                totalAttendance: { type: "integer", example: 0 },
                                                                totalHost: { type: "integer", example: 0 },
                                                                totalKickout: { type: "integer", example: 0 },
                                                                totalRaisedHand: { type: "integer", example: 0 },
                                                                totalThumbsup: { type: "integer", example: 0 },
                                                                totalThumbsdown: { type: "integer", example: 0 },
                                                                totalClaps: { type: "integer", example: 0 },
                                                                totalEchoInstances: { type: "integer", example: 0 },
                                                                totalRecordingClicks: { type: "integer", example: 0 },
                                                                totalCCClicks: { type: "integer", example: 0 },
                                                                totalTranscriptRequests: { type: "integer", example: 0 },
                                                                totalSummaryRequests: { type: "integer", example: 0 },
                                                                totalActionItemsGenerated: { type: "integer", example: 0 },
                                                                totalBirdsEyeViewClick: { type: "integer", example: 0 },
                                                                totalMyGroupViewClicked: { type: "integer", example: 0 },
                                                                totalScreenShares: { type: "integer", example: 0 },
                                                                totalCameraTurnOn: { type: "integer", example: 0 },
                                                                totalMicTurnOn: { type: "integer", example: 0 },
                                                                totalGroupsCreated: { type: "integer", example: 0 },
                                                                totalLocksGroup: { type: "integer", example: 0 },
                                                                totalUnlocksGroup: { type: "integer", example: 0 },
                                                                totalEventLinksCopied: { type: "integer", example: 0 },
                                                                totalMuteAllClickedSwitched: { type: "integer", example: 0 },
                                                                totalDisabledAllVideoSwitch: { type: "integer", example: 0 },
                                                                totalDisabledAllScrennShareSwitch: { type: "integer", example: 0 },
                                                                totalLobbyStatusSwitch: { type: "integer", example: 0 },
                                                                totalGroupAllowStatusSwitch: { type: "integer", example: 0 },
                                                                totalGrouplockStatusSwitch: { type: "integer", example: 0 },
                                                                totalPrivateVideoShareSwitch: { type: "integer", example: 0 },
                                                                totalPrivateScreenShareSwitch: { type: "integer", example: 0 },
                                                                totalWhiteBoardClicked: { type: "integer", example: 0 },
                                                                totalAnnotationBoardClicked: { type: "integer", example: 0 },
                                                                totalPollCreated: { type: "integer", example: 0 },
                                                                totalAnnouncementModeClicked: { type: "integer", example: 0 }
                                                            }
                                                        },
                                                        peers: {
                                                            type: "array",
                                                            items: {
                                                                $ref: "#/components/schemas/peerObject"
                                                            },
                                                            description: "Array of peer objects"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                totalCount: {
                                    type: "integer",
                                    example: 10 
                                }
                            }
                        },
                        message: { type: "string", example: "Event logs with peers fetched successfully" },
                        statusCode: { type: "integer", example: 200 },
                        success: { type: "boolean", example: true },
                        isOperationalError: { type: "boolean", example: false }
                    }
                },

                

            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: [path.resolve(__dirname, "routes/**/*.ts")]

    //apis: ["./routes/**/*.ts"],
    // apis: ["./Routes/**/*.ts","./routes/*.ts"],
    // "./dist/src/routes/**/*.js"
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Function to serve Swagger UI and Docs
function swaggerDocs(app: express.Application) {
    // Swagger UI documentation page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Swagger JSON format documentation
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`Docs available at http://localhost:${PORT}/docs`);
    console.log(`Download JSON doc at http://localhost:${PORT}/docs.json`);
    console.log(path.resolve(__dirname, "routes/**/*.ts"))
}

export default swaggerDocs;











