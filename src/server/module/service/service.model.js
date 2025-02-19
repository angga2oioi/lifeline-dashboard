//@ts-check
import mongoose from "../../utils/mongoose";
import { toJSON, paginate } from "../../utils/mongoose/plugins";

const { ObjectId, String } = mongoose.Schema.Types;

const ServiceSchema = new mongoose.Schema(
    {
        project: {
            type: ObjectId,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

ServiceSchema.index({ createdAt: 1 });
ServiceSchema.index({ updatedAt: 1 });

// add plugin that converts mongoose to json
ServiceSchema.plugin(toJSON);
ServiceSchema.plugin(paginate);

export default mongoose.models.Service ||
    mongoose.model("Service", ServiceSchema);
