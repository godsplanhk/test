export function extractTiktokUsername(url:string) {
    const match = url.match(/tiktok\.com\/@([a-zA-Z0-9_.-]+)/);
    return match ? match[1] : null;
}

import { JSDOM } from "jsdom";

export function parseJobDescription(html:string) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    function getText(selector:any) {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : "";
    }

    function getListItems(selector:any) {
        return Array.from(document.querySelectorAll(selector)).map(li => li.textContent.trim());
    }

    return {
        overview: getText("div > div > b"),
        role: getText("div:nth-of-type(6)"), // Extracting role description
        keyResponsibilities: getListItems("ul:nth-of-type(1) > li"),
        niceToHaveSkills: getListItems("ul:nth-of-type(2) > li"),
        requirements: getListItems("ul:nth-of-type(3) > li"),
    };
}


export const parseNaukriJobDetails = (htmlString:string) => {
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;
  
    // Helper function to get text content of a label-based section
    const getTextAfterLabel = (label: string) => {
      const boldElements = [...document.querySelectorAll("b")];
      const targetElement = boldElements.find((b) =>
        b.textContent && b.textContent.includes(label)
      );
      return targetElement?.nextSibling && targetElement.nextSibling.textContent ? targetElement.nextSibling.textContent.trim() : "";
    };
  
    // Helper function to get list items after a label
    const getListItemsAfterLabel = (label: string) => {
      const boldElements = [...document.querySelectorAll("b")];
      const targetElement = boldElements.find((b) =>
        b.textContent && b.textContent.includes(label)
      );
      return targetElement
        ? targetElement.parentElement 
          ? [...targetElement.parentElement.querySelectorAll("li")].map((li) =>
            li.textContent ? li.textContent.trim() : ""
          ) : []
        : [];
    };
  
    return {
      title: getTextAfterLabel("Job Title"),
      responsibilities: getListItemsAfterLabel("Responsibilities"),
      technicalRequirements: getListItemsAfterLabel(
        "Technical and Professional Requirements"
      ),
      preferredSkills: getTextAfterLabel("Preferred Skills")
        .split("<br />")
        .map((skill) => skill.trim())
        .filter((skill) => skill),
      additionalResponsibilities: getListItemsAfterLabel(
        "Additional Responsibilities"
      ),
      educationRequirements: getTextAfterLabel("Educational Requirements")
        .split(",")
        .map((edu) => edu.trim()),
      serviceLine: getTextAfterLabel("Service Line"),
    };
  };

  export const convertTimestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  
  export const convertSecondsToHHMMSS = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    return [hours, minutes, seconds]
      .map((unit) => String(unit).padStart(2, "0"))
      .join(":");
  };