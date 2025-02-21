//@ts-check
import { MANAGE_ACCOUNT_ROLES, MANAGE_PROJECT_ROLES } from "@/global/utils/constant";
import mongoose from "../../utils/mongoose";
import { toJSON, paginate } from "../../utils/mongoose/plugins";

const { String } = mongoose.Schema.Types;

const AccountSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        roles: {
            type: [String],
            enum: {
                values: [
                    MANAGE_ACCOUNT_ROLES,
                    MANAGE_PROJECT_ROLES,
                ],
                message: "{VALUE} is not supported",
            },
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

AccountSchema.index({ createdAt: 1 });
AccountSchema.index({ updatedAt: 1 });

// add plugin that converts mongoose to json
AccountSchema.plugin(toJSON);
AccountSchema.plugin(paginate);

export default mongoose.models.Account ||
    mongoose.model("Account", AccountSchema);
