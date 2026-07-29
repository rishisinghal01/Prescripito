import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import doctorModel from "./models/doctorModel.js";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing doctors
    await doctorModel.deleteMany({});
    console.log("Cleared existing doctors");

    const specialties = [
      "General physician",
      "Gynecologist",
      "Dermatologist",
      "Pediatricians",
      "Neurologist",
      "Gastroenterologist",
    ];

    const maleNames = ["James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph", "Thomas", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Paul", "Kevin", "Brian", "George", "Edward", "Ronald"];
    const femaleNames = ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Nancy", "Margaret", "Sandra", "Emily", "Donna", "Michelle", "Carol", "Amanda", "Melissa", "Deborah"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"];

    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const passwordHash = await bcrypt.hash("password123", 10);
    
    let count = 0;
    for (const speciality of specialties) {
      for (let i = 1; i <= 5; i++) {
        const isMale = Math.random() > 0.5;
        const firstName = isMale ? getRandomItem(maleNames) : getRandomItem(femaleNames);
        const lastName = getRandomItem(lastNames);
        const name = `Dr. ${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random()*1000)}@example.com`;
        
        const genderPath = isMale ? "men" : "women";
        const faceId = Math.floor(Math.random() * 99) + 1; // randomuser.me IDs go from 1 to 99
        const image = `https://randomuser.me/api/portraits/${genderPath}/${faceId}.jpg`;

        const doctorData = {
          name,
          email,
          password: passwordHash,
          image,
          speciality: speciality,
          degree: getRandomItem(["MBBS", "MD", "DO", "BDS"]),
          about: `Dr. ${lastName} is a highly experienced ${speciality} with a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.`,
          available: true,
          experience: `${Math.floor(Math.random() * 15) + 2} Years`,
          fees: `${(Math.floor(Math.random() * 8) + 3) * 10}`,
          address: { line1: `${Math.floor(Math.random() * 999) + 10} Medical Center Blvd`, line2: `Suite ${Math.floor(Math.random() * 500) + 100}, Health City` },
          date: Date.now()
        };
        await doctorModel.create(doctorData);
        count++;
      }
    }
    
    console.log(`Successfully added ${count} doctors with realistic names and images.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
