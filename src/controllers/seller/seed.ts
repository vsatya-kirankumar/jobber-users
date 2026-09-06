import { faker } from '@faker-js/faker';
import { BadRequestError, IBuyerDocument, IEducation, IExperience, ISellerDocument } from '@vsatya-kirankumar/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRandomBuyers } from '@users/services/buyer.service';
import { createSeller, getSellerByEmail } from '@users/services/seller.service';
import { v4 as uuidv4 } from 'uuid';
import { floor, random, sample, sampleSize } from 'lodash';

export const seed = async (req: Request, res: Response): Promise<void> => {
  const { count } = req.params;
  const buyers: IBuyerDocument[] = await getRandomBuyers(parseInt(count as string, 10));
  for (let i = 0; i < buyers.length; i++) {
    const buyer: IBuyerDocument = buyers[i];
    const isSellerExists: ISellerDocument | null = await getSellerByEmail(buyer?.email as string);
    if (isSellerExists) {
      throw new BadRequestError('Seller already exists.', 'SellerSeed seller() method error.');
    }

    const basicDescription: string = faker.commerce.productDescription();
    const skills: string[] = [
      'Programming',
      'Web development',
      'Mobile development',
      'Proof reading',
      'UI/UX',
      'Data Science',
      'Financial modeling',
      'Data analysis'
    ];
    const seller: ISellerDocument = {
      profilePublicId: uuidv4(),
      fullName: faker.person.fullName(),
      username: buyer.username,
      email: buyer.email,
      country: faker.location.country(),
      profilePicture: buyer.profilePicture,
      description: basicDescription.length <= 250 ? basicDescription : basicDescription.slice(0, 250),
      oneliner: faker.word.words({ count: { min: 5, max: 10 } }),
      skills: sampleSize(skills, sample([1, 4])),
      languages: [
        { language: 'English', level: 'Native' },
        { language: 'Spnish', level: 'Basic' },
        { language: 'German', level: 'Basic' }
      ],
      responseTime: parseInt(faker.commerce.price({ min: 1, max: 5, dec: 0 })),
      experience: randomExperiences(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
      education: randomEducation(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
      socialLinks: ['https://kickchatapp.com', 'http://youtube.com', 'https://facebook.com'],
      certificates: [
        {
          name: 'Flutter App Developer',
          from: 'Flutter Academy',
          year: 2021
        },
        {
          name: 'Android App Developer',
          from: '2019',
          year: 2020
        },
        {
          name: 'iOS App Developer',
          from: 'Apple Inc.',
          year: 2019
        }
      ]
    };
    await createSeller(seller);
  }

  res.status(StatusCodes.CREATED).json({ message: 'Sellers created successfully' });
};

const range = (from: number, count: number): number[] => {
  const years: number[] = [];
  const absCount = Math.abs(count);

  for (let i = 0; i <= absCount; i++) {
    const year = count < 0 ? from - i : from + i;
    years.push(year);
  }
  return years;
};

const randomExperiences = (count: number): IExperience[] => {
  const result: IExperience[] = [];

  for (let i = 0; i < count; i++) {
    const randomStartYears: number[] = range(2000, 6);
    const randomEndYears: string[] = ['Present', '2024', '2025', '2026', '2027', '2028'];
    const endYear = randomEndYears[floor(random(0.9) * randomEndYears.length)];

    const experience: IExperience = {
      company: faker.company.name(),
      title: faker.person.jobTitle(),
      startDate: `${faker.date.month()} ${randomStartYears[Math.floor(Math.random() * randomStartYears.length)]}`,
      endDate: endYear === 'Present' ? 'Present' : `${faker.date.month()} ${endYear}`,
      currentlyWorkingHere: endYear === 'Present',
      description: faker.commerce.productDescription().slice(0, 100)
    };

    result.push(experience);
  }

  return result;
};

const randomEducation = (count: number): IEducation[] => {
  const result: IEducation[] = [];

  for (let i = 0; i < count; i++) {
    const randomStartYears: number[] = range(2000, 6);

    const education: IEducation = {
      title: faker.person.jobTitle(),
      country: faker.location.country(),
      university: faker.person.jobTitle(),
      major: `${faker.person.jobArea()} ${faker.person.jobDescriptor()}`,
      year: `${randomStartYears[floor(random(0.9) * randomStartYears.length)]}`
    };

    result.push(education);
  }

  return result;
};

export { randomExperiences, randomEducation };
