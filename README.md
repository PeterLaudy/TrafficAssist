# TrafficAssist

This project was started as an assignment at an Angular training. Because of some feature creep it now looks more like a navigation system.

It has been put on GitHub so I can have a look at how I solved certain issues no matter where I'm working. As a free-lancer I'm not always working from the same desk or even from the same development system.

## Original idea

The original idea was to show traffic information about my route to work. You know the way, so no need for a navigation system, but you are interested in any traffic jams on your route.

## The used services

The route is calulated using [openroute service](https://openrouteservice.org/). It takes two GPS coordinates which are converted from street addresses by [Nominatim](https://nominatim.openstreetmap.org/). The route is combined with the traffic information from the Dutch [ANWB](https://www.anwb.nl/). Some extra details information is retrieved from [Overpass API](https://overpass-api.de/).

## What do I see on the screen?

On the landing page you can enter the two addresses between which the route is calculated. Pressing ENTER or RETURN will take you to the other page which will show information about the route and the traffic situation. Information is shown as it comes in from the external services. It will start with an overview of the route itself, soon followed by the traffic information. The cities in the areas you will be travelling in will be a bit later, because that service has a bit more work to do. At the same time you will also see a semi-transparent overlay with the 4x4 km area where you are locating according to your browser. It show some extra roads around the locations where you need to change directions.

## License

This software is released under the MIT license, basically meaning that you can do anything with it you want.

## Roadmap

Actually I like the software as is. I started the project so I would easier remember the things I learned during the Angular workshop. I am thinking about adding some unit tests to the code, since automatic testing of software is key in any serious software project.