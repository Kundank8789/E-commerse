import "./User";
import "./Category";
import "./Product";

// This file ensures all models are registered
export const models = {
  User: mongoose.models.User,
  Category: mongoose.models.Category,
  Product: mongoose.models.Product,
};