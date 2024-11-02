<?php

namespace Livechat\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Livechat\Actions\MakeCurrentVisitorIdentifier;
use Livechat\Models\ChatVisitor;

class ChatVisitorFactory extends Factory
{
    protected $model = ChatVisitor::class;

    public function definition(): array
    {
        $ip = $this->faker->ipv4;
        $country = Arr::random([
            'US',
            'DE',
            'FR',
            'GB',
            'CA',
            'AU',
            'JP',
            'CN',
            'IN',
            'RU',
        ]);
        $city = $this->getCity($country);
        $state = $country === 'US' ? $this->getState($city) : null;
        $isAnonymous = $this->faker->boolean(40);
        $hasUser = !$isAnonymous && $this->faker->boolean(40);
        $visitsCount = $this->faker->numberBetween(1, 10);

        $user =
            !$isAnonymous && $this->faker->boolean(40)
                ? User::factory()->create()
                : null;

        return [
            'user_identifier' => (new MakeCurrentVisitorIdentifier())->execute(
                $ip,
            ),
            'user_ip' => $ip,
            'email' => !$isAnonymous
                ? $user?->email ?? $this->faker->email
                : null,
            'name' => !$isAnonymous ? $user?->name ?? $this->faker->name : null,
            'country' => $country,
            'city' => $city,
            'state' => $state,
            'timezone' => $this->faker->timezone,
            'platform' => Arr::random(['windows', 'linux', 'ios', 'androidos']),
            'device' => Arr::random(['mobile', 'tablet', 'desktop']),
            'is_crawler' => $this->faker->boolean(5),
            'visits_count' => $visitsCount,
            'time_on_all_pages' =>
                $visitsCount * $this->faker->numberBetween(5000, 80000),
            'browser' => Arr::random([
                'chrome',
                'firefox',
                'edge',
                'internet explorer',
                'safari',
            ]),
            'user_agent' => $this->faker->userAgent,
            'last_active_at' => now(),
            'user_id' => $user?->id,
        ];
    }

    protected function getCity(string $country)
    {
        $citiesByPopulation = [
            'US' => [
                'New York',
                'Los Angeles',
                'Chicago',
                'Houston',
                'Phoenix',
                'Philadelphia',
                'San Antonio',
                'San Diego',
                'Dallas',
                'San Jose',
            ],
            'DE' => [
                'Berlin',
                'Hamburg',
                'Munich',
                'Cologne',
                'Frankfurt',
                'Stuttgart',
                'Düsseldorf',
                'Dortmund',
                'Essen',
                'Leipzig',
            ],
            'FR' => [
                'Paris',
                'Marseille',
                'Lyon',
                'Toulouse',
                'Nice',
                'Nantes',
                'Montpellier',
                'Strasbourg',
                'Bordeaux',
                'Lille',
            ],
            'GB' => [
                'London',
                'Birmingham',
                'Glasgow',
                'Liverpool',
                'Leeds',
                'Sheffield',
                'Edinburgh',
                'Bristol',
                'Manchester',
                'Leicester',
            ],
            'CA' => [
                'Toronto',
                'Montreal',
                'Calgary',
                'Ottawa',
                'Edmonton',
                'Mississauga',
                'Winnipeg',
                'Vancouver',
                'Brampton',
                'Quebec City',
            ],
            'AU' => [
                'Sydney',
                'Melbourne',
                'Brisbane',
                'Perth',
                'Adelaide',
                'Gold Coast',
                'Canberra',
                'Newcastle',
                'Wollongong',
                'Logan City',
            ],
            'JP' => [
                'Tokyo',
                'Yokohama',
                'Osaka',
                'Nagoya',
                'Sapporo',
                'Kobe',
                'Kyoto',
                'Fukuoka',
                'Kawasaki',
                'Saitama',
            ],
            'CN' => [
                'Shanghai',
                'Beijing',
                'Tianjin',
                'Guangzhou',
                'Shenzhen',
                'Chengdu',
                'Dongguan',
                'Chongqing',
                'Nanjing',
                'Xi\'an',
            ],
            'IN' => [
                'Mumbai',
                'Delhi',
                'Bangalore',
                'Hyderabad',
                'Ahmedabad',
                'Chennai',
                'Kolkata',
                'Surat',
                'Pune',
                'Jaipur',
            ],
            'RU' => [
                'Moscow',
                'Saint Petersburg',
                'Novosibirsk',
                'Yekaterinburg',
                'Nizhny Novgorod',
                'Kazan',
                'Chelyabinsk',
                'Omsk',
                'Samara',
                'Rostov-on-Don',
            ],
        ];

        return Arr::random($citiesByPopulation[$country]);
    }

    protected function getState(string $city)
    {
        $states = [
            'New York' => [
                'New York',
                'New Jersey',
                'Connecticut',
                'Pennsylvania',
                'Massachusetts',
            ],
            'Los Angeles' => [
                'California',
                'Nevada',
                'Arizona',
                'Oregon',
                'Washington',
            ],
            'Chicago' => [
                'Illinois',
                'Indiana',
                'Wisconsin',
                'Michigan',
                'Iowa',
            ],
            'Houston' => [
                'Texas',
                'Louisiana',
                'Oklahoma',
                'New Mexico',
                'Arkansas',
            ],
            'Phoenix' => [
                'Arizona',
                'California',
                'Nevada',
                'New Mexico',
                'Utah',
            ],
            'Philadelphia' => [
                'Pennsylvania',
                'New Jersey',
                'Delaware',
                'Maryland',
                'New York',
            ],
            'San Antonio' => [
                'Texas',
                'New Mexico',
                'Louisiana',
                'Oklahoma',
                'Arkansas',
            ],
            'San Diego' => [
                'California',
                'Arizona',
                'Nevada',
                'Oregon',
                'Utah',
            ],
            'Dallas' => [
                'Texas',
                'Oklahoma',
                'Arkansas',
                'Louisiana',
                'New Mexico',
            ],
            'San Jose' => [
                'California',
                'Nevada',
                'Arizona',
                'Oregon',
                'Washington',
            ],
        ];

        return Arr::random($states[$city]);
    }
}
