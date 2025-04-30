import { Plus } from "lucide-react";
import { baseUrl } from "../../utils/constent";
import React from "react";

// Reusable icon component
const PlusIcon = <span className="w-5 h-5 flex justify-center items-center"><Plus size={18} strokeWidth={3} /></span>;

// Helper function to create content objects
const createContent = (title, description, btnText) => ({ title, description, btnText });

// Common button structure
const createButton = (title, props = {}) => ({ title, icon: PlusIcon, ...props });

export const EmptyIdeaContent = [
    createContent("Create First Idea", "It's time to start the conversation! Create your first idea and get feedback from your team or community.", [createButton("Create Ideas", { openSheet: true })]),
    createContent("Create Tags", "Organize your ideas with customizable tags like 'High Priority' or 'Internal Idea' for better management.", [createButton("Create Tags", { navigateTo: `${baseUrl}/settings/tags` })]),
    createContent("Create Board", "Visually manage your ideas with boards like 'Feature Request' or 'Bug Reports' to track progress and prioritize tasks.", [createButton("Create Board", { navigateTo: `${baseUrl}/settings/board` })]),
    createContent("Create Widget", "Add a widget to display your ideas on your website with options like embed, popover, modal, or sidebar.", [createButton("Create Widget", { navigateTo: `${baseUrl}/widget/type` })]),
    createContent("Create Feedback", "Share your ideas via in-app messages and let users upvote and comment to refine and improve your suggestions.", [createButton("Create In-App Message", { navigateTo: `${baseUrl}/app-message/type` })]),
    createContent("Explore Examples", "See how platforms like Utterbond, Rebolt, and Rivyo manage customer feedback efficiently and effortlessly.", [
        createButton("Utterbond", { redirect: "https://utterbond.quickhunt.app/ideas" }),
        createButton("Rebolt", { redirect: "https://rebolt.quickhunt.app/ideas" }),
        createButton("Rivyo", { redirect: "https://rivyo.quickhunt.app/ideas" }),
    ]),
];

export const EmptyRoadmapContent = [
    createContent("Create First Roadmap", "Don’t keep users guessing! Start your roadmap to outline future plans and showcase it on your website for everyone to see.", [createButton("Create Roadmap", { openSheet: true })]),
    createContent("Create Roadmap Statuses", "Define statuses like 'Planned,' 'In Progress,' and 'Completed' to keep users informed about the progress of your roadmap items.", [createButton("Create Statuses", { navigateTo: `${baseUrl}/settings/statuses` })]),
    createContent("Turn Ideas into a Roadmap", "Easily transform shared ideas into actionable roadmap items to plan and showcase your product's future.", [createButton("Move Ideas to Roadmap", { navigateTo: `${baseUrl}/ideas` })]),
    createContent("Create Widget", "Add a widget to display your Roadmap on your website with options like embed, popover, modal, or sidebar.", [createButton("Create Widget", { navigateTo: `${baseUrl}/widget/type` })]),
    createContent("Create Announcement", "Share updates or milestones from your roadmap with users to keep them engaged and in the loop.", [createButton("Create Announcement", { navigateTo: `${baseUrl}/announcements?opensheet=open` })]),
    createContent("Explore Examples", "Discover how platforms like Utterbond, Rebolt, and Rivyo effectively manage their roadmaps.", [
        createButton("Utterbond", { redirect: "https://utterbond.quickhunt.app/roadmap" }),
        createButton("Rebolt", { redirect: "https://rebolt.quickhunt.app/roadmap" }),
        createButton("Rivyo", { redirect: "https://rivyo.quickhunt.app/roadmap" }),
    ]),
];

export const EmptyAnnounceContent = [
    createContent("Start Sharing Updates", "No announcements yet? Create your first one to keep users informed about product updates, new features, and improvements.", [createButton("Create Announcement", { openSheet: true })]),
    createContent("Create Labels", "Organize your announcements by adding labels like 'Update,' 'New Feature,' or 'Bug Fix' for easy categorization and clarity.", [createButton("Create Labels", { navigateTo: `${baseUrl}/settings/labels` })]),
    createContent("Create Categories", "Group your announcements into categories such as 'Product Updates,' 'Feature Launches,' or 'Changelog' to help users find relevant information quickly.", [createButton("Create Categories", { navigateTo: `${baseUrl}/settings/categories` })]),
    createContent("Add Emoji", "Make your announcements more engaging by adding emojis to highlight key updates or set the tone for your message.", [createButton("Add Emojis", { navigateTo: `${baseUrl}/settings/emoji` })]),
    createContent("Create In-App Message", "Share announcements directly with users through in-app messages to ensure they stay informed about important updates.", [createButton("Create In-App Message", { navigateTo: `${baseUrl}/app-message/type` })]),
    createContent("Explore Examples", "See how platforms like Utterbond, Rebolt, and Rivyo efficiently share announcements to keep their users informed.", [
        createButton("Utterbond", { redirect: "https://utterbond.quickhunt.app/announcements" }),
        createButton("Rebolt", { redirect: "https://rebolt.quickhunt.app/announcements" }),
        createButton("Rivyo", { redirect: "https://rivyo.quickhunt.app/announcements" }),
    ]),
];

export const EmptyUserContent = [
    createContent("Start Adding Users", "Manually add user details to build your base, track interactions, and personalize engagement to foster loyalty.", [createButton("Add User", { openSheet: true })]),
    createContent("Create Ideas", "Encourage user engagement by capturing and sharing ideas that resonate with your audience, turning visitors into active users.", [createButton("Create Ideas", { openSheet: true, navigateTo: `${baseUrl}/ideas?opensheet=open` })]),
    createContent("Create Roadmap", "Showcase your product’s journey with a roadmap, keeping users informed about upcoming features and updates to build trust and attract users.", [createButton("Create Roadmap", { navigateTo: `${baseUrl}/roadmap` })]),
    createContent("Create Announcement", "Share key updates, new features, and milestones through announcements to keep users engaged and excited about your product.", [createButton("Create Announcement", { openSheet: true, navigateTo: `${baseUrl}/announcements?opensheet=open` })]),
    createContent("Create Widget", "Add a widget to your website to display ideas, roadmaps, or updates, making it easy for users to interact and connect with your product.", [createButton("Create Widget", { navigateTo: `${baseUrl}/widget/type` })]),
    createContent("Create Knowledge Base", "Offer valuable resources and answers to build confidence in your product and convert visitors into loyal users.", [createButton("Create Knowledge Base", { navigateTo: `${baseUrl}/app-message/type` })]),
];

export const EmptyInAppContent = [
    createContent("Create Welcome Message", "Use in-app messages, such as posts or banners, to greet new users and introduce them to your app.", [createButton("Create Welcome Message", { navigateTo: "type" })]),
    createContent("Create Onboarding Flow", "Guide users through the onboarding process with a checklist and in-app messages to ensure they get the most out of your app.", [createButton("Create Checklist", { navigateTo: "4/new" })]),
    createContent("Share Ideas", "Share your product ideas directly with users using in-app messages through posts or banners to gather feedback and keep them engaged.", [createButton("Share Ideas", { navigateTo: `${baseUrl}/ideas` })]),
    createContent("Display Announcements", "Keep users updated with in-app messages about new features, product updates, and improvements through posts or banners.", [createButton("Display Announcement", { navigateTo: `${baseUrl}/announcements` })]),
    createContent("Get Feedback", "Use in-app surveys to collect feedback directly within the app, helping you improve the user experience and gather insights.", [createButton("Collect Feedback", { navigateTo: "3/new" })]),
    createContent("Redirect to Knowledge Base", "Promote new feature articles through in-app messages, directing users to relevant resources in your knowledge base for more information.", [createButton("Create In-App Message", { navigateTo: "type" })]),
];

export const EmptyInWidgetContent = [
    createContent("Embed Widget", "Easily embed a widget on your website to display key information or engage users without disrupting the browsing experience.", [createButton("Create Embed Widget", { navigateTo: "embed/new" })]),
    createContent("Popover Widget", "Use a popover widget to show important updates or offers in a small, non-intrusive popup that appears on the screen.", [createButton("Create Popover Widget", { navigateTo: "popover/new" })]),
    createContent("Modal Widget", "Create a modal widget to display more detailed information or prompts in a full-screen overlay, ensuring user attention.", [createButton("Create Modal Widget", { navigateTo: "modal/new" })]),
    createContent("Sidebar Widget", "Add a sidebar widget to your website to showcase updates, product features, or quick links, offering easy access without overwhelming the page.", [createButton("Create Sidebar Widget", { navigateTo: "sidebar/new" })]),
    createContent("General Settings", "Customize the appearance and behavior of your widgets to match your website design and provide a seamless user experience.", [createButton("Manage General Settings", { navigateTo: `${baseUrl}/settings/general-settings` })]),
    createContent("Social Links", "Integrate social media links directly into your widget to encourage user engagement and promote your online presence.", [createButton("Add Social Links", { navigateTo: `${baseUrl}/settings/social` })]),
];

export const EmptyInArticlesContent = [
    createContent("Start Adding Helpful Articles", "No articles yet? Begin by creating informative articles that address common customer questions, reduce support queries, and empower users to find answers quickly.", [createButton("Create First Article", { openSheet: true })]),
];

export const EmptyInCategoryContent = [
    createContent("Build a Structured Knowledge Base", "Create categories and sub-categories to better organize your content, helping users navigate your articles with ease.", [createButton("Create Categories", { openSheet: true })]),
];