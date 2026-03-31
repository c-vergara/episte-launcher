export const MODES = [
  {
    id: "taxonomy",
    keys: ["e"],
    title: "Go to EET term",
    url: "https://app.iloveevidence.com/taxonomy/{ID}",
  },
  {
    id: "reference",
    keys: ["r"],
    title: "See reference in LOVE",
    url: "https://app.iloveevidence.com/references/{ID}/info",
  },
  {
    id: "document",
    keys: ["d"],
    title: "See reference in Epistemonikos",
    url: "https://www.epistemonikos.org/en/documents/{ID}",
  },
  {
    id: "thread",
    keys: ["t"],
    title: "Go to Thread",
    url: "https://epistemonikos.org/en/threads/{ID}",
  },
];

export const QUICK_LINKS = [
  {
    id: "trials-search",
    title: "Trials search",
    url: "https://trials.epistemonikos.org/en/search",
  },
  {
    id: "all-episte-search",
    title: "All episte search",
    url: "https://all.epistemonikos.org/en?page=1&per_page=10",
  },
  {
    id: "sk-organizations",
    title: "SK organizations",
    url: "https://www.skplatform.org/app/organizations",
    image: "skplatform.png",
  },
];
