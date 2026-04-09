import { Response } from "express";
import { z } from "zod";
import { habitService } from "../services/habit-service";
import { AuthenticatedRequest } from "../types/auth";

const habitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().min(1),
  color: z.string().min(1),
  reminderEnabled: z.boolean().default(false)
});

export const habitController = {
  async home(request: AuthenticatedRequest, response: Response) {
    const data = await habitService.getHome(request.user!.sub);
    return response.json(data);
  },

  async create(request: AuthenticatedRequest, response: Response) {
    const body = habitSchema.parse(request.body);
    const data = await habitService.createHabit(request.user!.sub, body);
    return response.status(201).json(data);
  },

  async update(request: AuthenticatedRequest, response: Response) {
    const habitId = z.string().parse(request.params.id);
    const body = habitSchema.partial().parse(request.body);
    const data = await habitService.updateHabit(request.user!.sub, habitId, body);
    return response.json(data);
  },

  async details(request: AuthenticatedRequest, response: Response) {
    const habitId = z.string().parse(request.params.id);
    const data = await habitService.getHabitDetails(request.user!.sub, habitId);
    return response.json(data);
  },

  async checkin(request: AuthenticatedRequest, response: Response) {
    const habitId = z.string().parse(request.params.id);
    const body = z.object({ date: z.string().optional() }).parse(request.body);
    const data = await habitService.checkin(request.user!.sub, habitId, body.date);
    return response.json(data);
  },

  async calendar(request: AuthenticatedRequest, response: Response) {
    const month = z.string().regex(/^\d{4}-\d{2}$/).parse(request.query.month);
    const data = await habitService.getCalendar(request.user!.sub, month);
    return response.json(data);
  }
};
