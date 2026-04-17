import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    phone: {
      type:     String,
      required: [true, 'Phone number is required'],
      unique:   true,
      trim:     true,
      match:    [/^\d{10}$/, 'Phone must be exactly 10 digits'],
    },
    role: {
      type:    String,
      enum:    ['user', 'pharmacist', 'dermatologist'],
      default: 'user',
    },
    name:     { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    age:      { type: Number, min: 1, max: 120 },
    gender: {
      type:    String,
      enum:    ['male', 'female', 'other', 'prefer-not-to-say', ''],
      default: '',
    },
    profileCompleted: { type: Boolean, default: false },
    password:         { type: String, select: false },
  },
  { timestamps: true }
);

/* ── Performance indexes ── */
userSchema.index({ phone: 1 }, { unique: true }); // fast login lookup
userSchema.index({ role: 1 });                     // filter by role
userSchema.index({ createdAt: -1 });               // newest users first

/* ── Hash password before save ── */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);