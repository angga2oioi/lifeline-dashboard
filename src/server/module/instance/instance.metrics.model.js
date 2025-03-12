//@ts-check
import mongoose from "../../utils/mongoose";
import { toJSON, paginate } from "../../utils/mongoose/plugins";

const {  String, Mixed } = mongoose.Schema.Types;

const InstanceMetricsSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        metrics: {
            type: Mixed,
        }
    },
    {
        timestamps: true,
    }
);

InstanceMetricsSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 }
);
InstanceMetricsSchema.index({ updatedAt: 1 });

// add plugin that converts mongoose to json
InstanceMetricsSchema.plugin(toJSON);
InstanceMetricsSchema.plugin(paginate);

export default mongoose.models.InstanceMetrics ||
    mongoose.model("InstanceMetrics", InstanceMetricsSchema);
