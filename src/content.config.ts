import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.preprocess((val) => {
                     let input: string;

                     if (typeof val === "string") {
                       input = val;
                     } else if (val instanceof Date) {
                       input = val.toISOString();
                     } else {
                       throw new Error("Invalid date format in pubDatetime");
                     }

                     const utcDate = dayjs.tz(input, "Asia/Kolkata").utc().toDate();

//                      if (process.env.NODE_ENV === "development") {
//                        console.log("IST input:", input);
//                        console.log("Converted to UTC:", utcDate.toISOString());
//                      }

                     return utcDate;
                   }, z.date()),
      modDatetime: z.preprocess((val) => {
                     if (!val) return null;

                     let input: string;

                     if (typeof val === "string") {
                       input = val;
                     } else if (val instanceof Date) {
                       input = val.toISOString();
                     } else {
                       throw new Error("Invalid date format in modDatetime");
                     }

                     const utcDate = dayjs.tz(input, "Asia/Kolkata").utc().toDate();

//                      if (process.env.NODE_ENV === "development") {
//                        console.log("Modified IST input:", input);
//                        console.log("Modified UTC:", utcDate.toISOString());
//                      }

                     return utcDate;
                   }, z.date().nullable().optional()),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

export const collections = { blog };
