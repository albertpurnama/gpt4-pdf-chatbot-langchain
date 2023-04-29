import formidable from "formidable";
import type { NextApiRequest } from "next";

export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise(async (resolve, reject) => {

    const form = formidable({
      maxFiles: 2,
      maxFileSize: 10 * 1024 * 1024, // 10mb
      filter: (part) => {
        return (
          part.name === "media" && (part.mimetype?.includes("application/pdf") || false)
        );
      },
    });

    form.parse(req, function (err, fields, files) {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
