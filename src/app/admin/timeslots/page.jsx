"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Clock, Plus, Trash2, Save, Video, Camera, Move3D } from "lucide-react";

const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const TIME_PERIODS = [
  { label: "Morning", value: "morning", startTime: "08:00", endTime: "12:00" },
  { label: "Afternoon", value: "afternoon", startTime: "12:00", endTime: "17:00" },
  { label: "Evening", value: "evening", startTime: "17:00", endTime: "21:00" }
];

const SERVICE_TYPES = [
  { label: "Photography", value: "photography", icon: Camera },
  { label: "Video - Short Form", value: "video_short", icon: Video },
  { label: "Video - Long Form", value: "video_long", icon: Video },
  { label: "360° Virtual Tour", value: "tour_360", icon: Move3D }
];

const PROPERTY_TYPES = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa/TH", value: "villa_th" },
  { label: "Commercial", value: "commercial" }
];

const PROPERTY_SIZES = [
  { label: "Studio", value: "studio" },
  { label: "1 Bed", value: "1bed" },
  { label: "2 Bed", value: "2bed" },
  { label: "3 Bed", value: "3bed" },
  { label: "4+ Bed", value: "4plusbed" },
  { label: "Basic", value: "basic" },
  { label: "Essential", value: "essential" },
  { label: "Premium", value: "premium" },
  { label: "Elite", value: "elite" }
];

const SLOT_RESTRICTIONS = [
  { label: "Morning Only", value: "morning_only" },
  { label: "Afternoon Only", value: "afternoon_only" },
  { label: "Evening Only", value: "evening_only" },
  { label: "Morning + Afternoon", value: "morning_afternoon" },
  { label: "Morning + Evening", value: "morning_evening" },
  { label: "Afternoon + Evening", value: "afternoon_evening" },
  { label: "All Day", value: "all_day" }
];

export default function TimeSlotsManager() {
  const [timeSlots, setTimeSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: "",
    period: "",
    maxBookings: 1,
    isActive: true,
    serviceCombinations: [],
    propertyType: "",
    propertySize: "",
    slotRestriction: "",
    slotsRequired: 1
  });

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    try {
      // In a real app, this would fetch from your API
      const savedSlots = localStorage.getItem('adminTimeSlots');
      if (savedSlots) {
        setTimeSlots(JSON.parse(savedSlots));
      } else {
        // Initialize with default slots
        const defaultSlots = {};
        DAYS_OF_WEEK.forEach(day => {
          defaultSlots[day] = [
            { period: "morning", label: "Morning", startTime: "08:00", endTime: "12:00", maxBookings: 3, isActive: true },
            { period: "afternoon", label: "Afternoon", startTime: "12:00", endTime: "17:00", maxBookings: 5, isActive: true },
            { period: "evening", label: "Evening", startTime: "17:00", endTime: "21:00", maxBookings: 4, isActive: true },
          ];
        });
        setTimeSlots(defaultSlots);
      }
    } catch (error) {
      toast.error("Failed to load time slots");
    }
  };

  const saveTimeSlots = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to your API
      localStorage.setItem('adminTimeSlots', JSON.stringify(timeSlots));
      toast.success("Time slots saved successfully!");
    } catch (error) {
      toast.error("Failed to save time slots");
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = () => {
    if (!newSlot.day || !newSlot.period) {
      toast.error("Please select a day and time period");
      return;
    }

    const selectedPeriod = TIME_PERIODS.find(p => p.value === newSlot.period);
    const daySlots = timeSlots[newSlot.day] || [];
    
    // Check if this period already exists for this day
    if (daySlots.some(slot => slot.period === newSlot.period)) {
      toast.error("This time period already exists for this day");
      return;
    }

    const updatedSlots = {
      ...timeSlots,
      [newSlot.day]: [...daySlots, { 
        period: newSlot.period,
        label: selectedPeriod.label,
        startTime: selectedPeriod.startTime,
        endTime: selectedPeriod.endTime,
        maxBookings: newSlot.maxBookings,
        isActive: true
      }]
    };
    
    setTimeSlots(updatedSlots);
    setNewSlot({
      day: "",
      period: "",
      maxBookings: 1,
      isActive: true
    });
    
    toast.success("Time slot added successfully!");
  };

  const removeTimeSlot = (day, index) => {
    const daySlots = timeSlots[day] || [];
    const updatedSlots = {
      ...timeSlots,
      [day]: daySlots.filter((_, i) => i !== index)
    };
    
    setTimeSlots(updatedSlots);
    toast.success("Time slot removed successfully!");
  };

  const toggleSlotStatus = (day, index) => {
    const daySlots = timeSlots[day] || [];
    const updatedSlots = {
      ...timeSlots,
      [day]: daySlots.map((slot, i) => 
        i === index ? { ...slot, isActive: !slot.isActive } : slot
      )
    };
    
    setTimeSlots(updatedSlots);
  };

  const updateSlotMaxBookings = (day, index, maxBookings) => {
    const daySlots = timeSlots[day] || [];
    const updatedSlots = {
      ...timeSlots,
      [day]: daySlots.map((slot, i) => 
        i === index ? { ...slot, maxBookings: parseInt(maxBookings) || 1 } : slot
      )
    };
    
    setTimeSlots(updatedSlots);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Time Slots Management</h1>
        <Button onClick={saveTimeSlots} disabled={loading} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Add New Time Slot */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Time Slot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="day">Day</Label>
              <Select value={newSlot.day} onValueChange={(value) => setNewSlot({ ...newSlot, day: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="period">Time Period</Label>
              <Select value={newSlot.period} onValueChange={(value) => setNewSlot({ ...newSlot, period: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_PERIODS.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label} ({period.startTime} - {period.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="maxBookings">Max Bookings</Label>
              <Input
                id="maxBookings"
                type="number"
                min="1"
                value={newSlot.maxBookings}
                onChange={(e) => setNewSlot({ ...newSlot, maxBookings: parseInt(e.target.value) || 1 })}
                placeholder="Max bookings"
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={addTimeSlot} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Combinations Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Service Combinations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Available Services</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {SERVICE_TYPES.map(service => (
                  <div key={service.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={newSlot.serviceCombinations.includes(service.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewSlot({ ...newSlot, serviceCombinations: [...newSlot.serviceCombinations, service.value] });
                        } else {
                          setNewSlot({ ...newSlot, serviceCombinations: newSlot.serviceCombinations.filter(s => s !== service.value) });
                        }
                      }}
                    />
                    <service.icon className="w-4 h-4" />
                    <span className="text-sm">{service.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Type and Size Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Property Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Property Type</Label>
              <Select value={newSlot.propertyType} onValueChange={(value) => setNewSlot({ ...newSlot, propertyType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Property Size</Label>
              <Select value={newSlot.propertySize} onValueChange={(value) => setNewSlot({ ...newSlot, propertySize: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property size" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_SIZES.map(size => (
                    <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slot Restrictions Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Slot Restrictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Time Restriction</Label>
              <Select value={newSlot.slotRestriction} onValueChange={(value) => setNewSlot({ ...newSlot, slotRestriction: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select restriction" />
                </SelectTrigger>
                <SelectContent>
                  {SLOT_RESTRICTIONS.map(restriction => (
                    <SelectItem key={restriction.value} value={restriction.value}>{restriction.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Slots Required</Label>
              <Input
                type="number"
                min="1"
                value={newSlot.slotsRequired}
                onChange={(e) => setNewSlot({ ...newSlot, slotsRequired: parseInt(e.target.value) || 1 })}
                placeholder="Number of slots"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots by Day */}
      <div className="space-y-6">
        {DAYS_OF_WEEK.map(day => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {day}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeSlots[day] && timeSlots[day].length > 0 ? (
                <div className="space-y-3">
                  {timeSlots[day].map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <Checkbox
                            checked={slot.isActive}
                            onCheckedChange={() => toggleSlotStatus(day, index)}
                          />
                          <div>
                            <span className={`font-medium ${!slot.isActive ? 'text-gray-400 line-through' : ''}`}>
                              {slot.label}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({slot.startTime} - {slot.endTime})
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Max {slot.maxBookings} booking{slot.maxBookings > 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        {/* Service Combinations Display */}
                        {slot.serviceCombinations && slot.serviceCombinations.length > 0 && (
                          <div className="mt-2 p-2 bg-gray-50 rounded">
                            <div className="text-xs font-medium text-gray-700 mb-1">Services:</div>
                            <div className="flex flex-wrap gap-2">
                              {slot.serviceCombinations.map(service => {
                                const serviceType = SERVICE_TYPES.find(s => s.value === service);
                                return (
                                  <span key={service} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    <serviceType.icon className="w-3 h-3 mr-1" />
                                    {serviceType.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Property Configuration Display */}
                        {(slot.propertyType || slot.propertySize) && (
                          <div className="mt-2 p-2 bg-gray-50 rounded">
                            <div className="text-xs font-medium text-gray-700 mb-1">Property:</div>
                            <div className="text-xs text-gray-600">
                              {slot.propertyType && (
                                <span className="mr-2">
                                  {PROPERTY_TYPES.find(t => t.value === slot.propertyType)?.label}
                                </span>
                              )}
                              {slot.propertySize && (
                                <span>
                                  ({PROPERTY_SIZES.find(s => s.value === slot.propertySize)?.label})
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Slot Restrictions Display */}
                        {slot.slotRestriction && (
                          <div className="mt-2 p-2 bg-gray-50 rounded">
                            <div className="text-xs font-medium text-gray-700 mb-1">Restriction:</div>
                            <div className="text-xs text-gray-600">
                              {SLOT_RESTRICTIONS.find(r => r.value === slot.slotRestriction)?.label}
                            </div>
                          </div>
                        )}
                        
                        {/* Slots Required Display */}
                        {slot.slotsRequired && slot.slotsRequired > 1 && (
                          <div className="mt-2 p-2 bg-gray-50 rounded">
                            <div className="text-xs font-medium text-gray-700 mb-1">Slots Required:</div>
                            <div className="text-xs text-gray-600">{slot.slotsRequired}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={slot.maxBookings}
                          onChange={(e) => updateSlotMaxBookings(day, index, e.target.value)}
                          className="w-20 h-8 text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(day, index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No time slots configured for {day}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
