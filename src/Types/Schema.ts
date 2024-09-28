import { z } from "zod";

export const signUpSchema = z.object({
  fullname: z
      .string()
      .transform(fullname => fullname.trim())
      .refine(fullname => fullname.length >= 2, {
        message:
          "Full name must have at least  2 characters after removing spaces",
      })
      .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
        message: "Full name must not contain numbers",
      }),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(
        8,
        "Password must have at least 8 characters with alphanumber combination"
      )
      .refine(password => /[A-Za-z][0-9]/.test(password), {
        message: "Password must contain at least one letter and number",
      }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  //////////////////////////////////////////////  PROFESION SCHEMA ////////////////////////////////////

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg'];

  export const proVerfySchema = z.object({
    fullname: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 2, {
      message:
        "Full name must have at least  2 characters after removing spaces",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "Full name must not contain numbers",
    }), 

  
    Profession: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 2, {
      message:
        "Profession must have at least  2 characters after removing spaces",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "Profession name must not contain numbers",
    }), 

    subProfession: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 2, {
      message:
        "subProfession must have at least  2 characters after removing spaces",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "subProfession name must not contain numbers",
    }), 

    working: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 2, {
      message:
        "working must have at least  2 characters after removing spaces",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "working name must not contain numbers",
    }), 

    Linkedin: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 3, {
      message:
        "incomplete link",
    })  , 

    achievements: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 2, {
      message:
        "achievements must have at least  2 characters after removing spaces",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "achievements name must not contain numbers",
    }), 

    about: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 5, {
      message:
        "about must have more than 5 characters",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "about name must not contain numbers",
    }), 

    file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: `Supported file types are ${ALLOWED_IMAGE_TYPES.join(", ")}.`,
    }),

    country: z.string().nonempty(),

  })

  //////////////////////////////////////////////  PROFILE SCHEMA  //////////////////////////////////////////////////////

  export const profileSchema = z.object({
    profession: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 2, {
      message:
        "Words must have at least  2 characters",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "Full name must not contain numbers",
    }), 

    education: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 2, {
      message:
      "Words must have at least  2 characters",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "working name must not contain numbers",
    }), 

    gender: z.string().nonempty(),

    
    hobbies: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 2, {
      message:
      "Words must have at least  2 characters",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "hobbies name must not contain numbers",
    }), 
    
    Interest: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 2, {
      message:
      "Words must have at least  2 characters",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "Interest name must not contain numbers",
    }), 
  
    country: z.string().nonempty(),

    Linkedin: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 3, {
      message:
        "incomplete link",
    })  , 
    
    state: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 2, {
      message:
      "Words must have at least  2 characters",
    })
    .refine(fullname => /^[a-zA-Z\s]*$/.test(fullname), {
      message: "state name must not contain numbers",
    }), 

    about: z
    .string()
    .transform(fullname => fullname.trim())
    .refine(fullname => fullname.length >= 5, {
      message:
        "about must have more than 5 characters",
    })
   ,

    file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: `Supported file types are ${ALLOWED_IMAGE_TYPES.join(", ")}.`,
    }),

  })