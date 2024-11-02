<?php

namespace Livechat\Factories;

use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Livechat\Models\ChatVisit;

class ChatVisitFactory extends Factory
{
    protected $model = ChatVisit::class;

    public function definition(): array
    {
        $data = $this->getData();

        $period = CarbonPeriod::create(now()->subHours(24), now());
        $date = Arr::random($period->toArray());

        return [
            'url' => $data['url'],
            'title' => $data['title'],
            'referrer' => $data['referrer'],
            'created_at' => $date,
            'ended_at' => $date
                ->copy()
                ->addSeconds($this->faker->numberBetween(8, 300)),
        ];
    }

    protected function getData(): array
    {
        $data = [
            [
                'url' => url('products/laptops'),
                'title' => 'Shop Laptops - Find the Perfect Device',
                'referrer' => url('products'),
            ],
            [
                'url' => url('support/contact-us'),
                'title' => 'Contact Us - We\'re Here to Help',
                'referrer' => url('support'),
            ],
            [
                'url' => url('services/digital-marketing'),
                'title' =>
                    'Digital Marketing Services - Speak with Our Experts',
                'referrer' => url('services'),
            ],
            [
                'url' => url('checkout/cart'),
                'title' => 'Your Cart - Ready to Checkout?',
                'referrer' => url('products/laptops'),
            ],
            [
                'url' => url('insurance/auto'),
                'title' => 'Auto Insurance Quotes - Get a Personalized Rate',
                'referrer' => url('insurance'),
            ],
            [
                'url' => url('faqs'),
                'title' => 'Frequently Asked Questions - Quick Answers',
                'referrer' => url('home'),
            ],
            [
                'url' => url('real-estate/listings'),
                'title' => 'View Real Estate Listings - Explore Homes Near You',
                'referrer' => url('real-estate/home'),
            ],
            [
                'url' => url('healthcare/appointments'),
                'title' =>
                    'Book Healthcare Appointments - Convenient Scheduling',
                'referrer' => url('healthcare/services'),
            ],
            [
                'url' => url('telecom/plans'),
                'title' => 'Compare Telecom Plans - Find the Best Option',
                'referrer' => url('telecom'),
            ],
            [
                'url' => url('education/online-courses'),
                'title' => 'Explore Online Courses - Start Learning Today',
                'referrer' => url('education'),
            ],
            [
                'url' => url('products/smartphones'),
                'title' => 'Shop Smartphones - Discover the Latest Models',
                'referrer' => url('products'),
            ],
            [
                'url' => url('hotel/bookings'),
                'title' => 'Hotel Bookings - Reserve Your Stay',
                'referrer' => url('travel'),
            ],
            [
                'url' => url('automotive/dealership'),
                'title' => 'Find a Car Dealership - Browse Inventory',
                'referrer' => url('automotive'),
            ],
            [
                'url' => url('travel/flights'),
                'title' => 'Book Flights - Compare Prices and Destinations',
                'referrer' => url('travel'),
            ],
            [
                'url' => url('software/solutions'),
                'title' =>
                    'Software Solutions - Choose the Right Tool for Your Business',
                'referrer' => url('software'),
            ],
            [
                'url' => url('finance/loans'),
                'title' => 'Personal Loans - Apply for Financing',
                'referrer' => url('finance'),
            ],
            [
                'url' => url('events/conferences'),
                'title' => 'Upcoming Conferences - Register for Events',
                'referrer' => url('events'),
            ],
            [
                'url' => url('fashion/mens-clothing'),
                'title' => 'Shop Men\'s Clothing - Latest Trends and Styles',
                'referrer' => url('fashion'),
            ],
            [
                'url' => url('fitness/memberships'),
                'title' => 'Gym Memberships - Find a Location Near You',
                'referrer' => url('fitness'),
            ],
            [
                'url' => url('home/appliances'),
                'title' => 'Home Appliances - Upgrade Your Home Comfort',
                'referrer' => url('home'),
            ],
        ];

        return $data[array_rand($data)];
    }
}
