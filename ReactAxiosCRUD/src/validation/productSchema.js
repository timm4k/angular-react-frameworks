import * as yup from "yup";

export const productSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Product name is required")
      .min(3, "Name must contain at least 3 characters"),
    price: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .typeError("Price must be a number")
      .positive("Price must be greater than 0")
      .required("Price is required"),
    category: yup
      .string()
      .oneOf(["electronics", "clothes", "books"], "Choose a valid category")
      .required("Category is required"),
    description: yup
      .string()
      .trim()
      .max(200, "Description cannot exceed 200 characters"),
    inStock: yup.boolean().required(),
    image: yup.string().required("Product photo is required").default(""),
  })
  .required();
