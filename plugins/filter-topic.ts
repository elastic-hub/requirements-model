// plugins/filterTopic.ts

export default defineNuxtPlugin((nuxtApp) => {
    type AgendaTopic = {
        title: string;
        id: string;
        url?: string;
        discussed?: boolean;
        releaseVersion?: string;
        platform?: string;
    };

    type Meeting = {
        id: string;
        groupID?: string;
        agendaTopics: AgendaTopic[];
        attendees?: { name: string }[];
        links?: {
            minutes?: string;
            recording?: string;
            segmented_transcript?: string;
        };
    };

    type MeetingRegister = {
        meetings: Meeting[];
    };

    type FormattedMeeting = {
        id: string;
        idURL?: string;
        title: string;
        link?: string;
        discussed?: string;
        releaseVersion?: string;
        meetingID?: string;
        group?: string;
        attendees?: string;
        recording?: string;
        minutes?: string;
        minutesUrl?: string;
        segmented_transcript?: string;
        combinedID?: string;
        platform?: string;
    };

    // Define the function to process meeting data
    const filterTopic = (meetingRegister: MeetingRegister): FormattedMeeting[] => {
        const formattedMeetings: FormattedMeeting[] = [];

        meetingRegister.meetings?.forEach((meeting) => {

            meeting.agendaTopics.forEach((topic) => {
                if (!topic.discussed) return;

                formattedMeetings.push({
                    id: topic.id,
                    idURL: topic.url ? topic.url : undefined,
                    title: topic.title,
                    link: topic.url || undefined,
                    discussed: topic.discussed ? "YES" : "NO",
                    releaseVersion: topic.releaseVersion,
                    meetingID: meeting.id,
                    group: meeting.groupID,
                    attendees: meeting.attendees && meeting.attendees.length > 0 ? meeting.attendees?.map((attendee) => attendee.name.length > 0 ? attendee.name : "<MISSING NAME(S)>").join(", ") : "Missing Attendees",
                    recording: meeting.links?.recording
                        ? `${meeting.links.recording}`
                        : `/_wip`,
                    minutes: meeting.links?.minutes ? "Meeting Minutes" : `/_wip`,
                    minutesUrl: meeting.links?.minutes || `/_wip`,
                    segmented_transcript: meeting.links?.segmented_transcript ? `${meeting.links.segmented_transcript}` : `/_wip`,
                    combinedID: topic.id + ' ' + meeting.id,
                    platform: topic.platform === "" ? undefined : topic.platform,
                });
            });
        });

        return formattedMeetings;
    };

    // Provide the function as part of the plugin
    return {
        provide: {
            filterTopic,
        },
    };
});
