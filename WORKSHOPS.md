# Workshops Configuration Guide

This document explains how to configure and manage workshops for the DevFest Armenia 2025 website.

## Configuration File

Workshop data is stored in `public/workshops.json`. This JSON file contains an array of workshop objects.

## Workshop Object Structure

Each workshop object has the following properties:

```json
{
  "id": "unique-workshop-id",
  "title": "Workshop Title",
  "description": "Detailed description of what participants will learn",
  "speakerImage": "path/to/speaker/image.jpg",
  "speakerName": "Speaker Name",
  "maxParticipants": 30,
  "registrationUrl": "https://forms.gle/YOUR_GOOGLE_FORM_ID"
}
```

### Property Descriptions

- **id**: Unique identifier for the workshop (lowercase, dash-separated)
- **title**: The workshop title displayed on the card
- **description**: A brief description of the workshop content and what participants will learn
- **speakerImage**: Path to the speaker's image (relative to the public folder)
- **speakerName**: Name of the workshop facilitator
- **maxParticipants**: Maximum number of participants allowed
- **registrationUrl**: Google Forms URL for workshop registration

## Adding a New Workshop

1. Open `public/workshops.json`
2. Add a new workshop object to the array
3. Fill in all required properties
4. Save the file

The website will automatically load and display the new workshop.

## Best Practices

### Images
- Use high-quality speaker photos (recommended: 400x400px minimum)
- Store images in the `public` folder or a subdirectory
- Use web-optimized formats (JPEG for photos, PNG for graphics with transparency)
- Keep file sizes reasonable (< 200KB per image)

### Registration URLs
- Create a Google Form for each workshop
- Use the short URL format: `https://forms.gle/FORM_ID`
- Test the form URL before adding it to the configuration
- Consider limiting responses to match `maxParticipants`

### Descriptions
- Keep descriptions concise but informative (2-3 sentences)
- Highlight key technologies or skills participants will learn
- Use action-oriented language ("Learn how to...", "Build a...", etc.)

## Workshop Information Banner

The workshops section includes an informational banner that highlights:
- Workshop duration (1-1.5 hours)
- Hands-on learning approach
- Google Cloud credits provided
- What participants need to bring

This information is hardcoded in `src/main.ts`. To modify it, search for the "What to Expect from Our Workshops" section.

## Example Configuration

```json
[
  {
    "id": "flutter-mobile-apps",
    "title": "Building Cross-Platform Apps with Flutter",
    "description": "Create beautiful native mobile applications for iOS and Android using Flutter. Learn the fundamentals of Dart, widgets, and state management.",
    "speakerImage": "speakers/jane-doe.jpg",
    "speakerName": "Jane Doe",
    "maxParticipants": 25,
    "registrationUrl": "https://forms.gle/ABC123XYZ"
  }
]
```

## Troubleshooting

### Workshops not displaying
- Check that `public/workshops.json` is valid JSON (use a JSON validator)
- Verify all required properties are present in each workshop object
- Check browser console for error messages

### Images not loading
- Verify image paths are correct and relative to the `public` folder
- Ensure images are properly uploaded to the repository
- Check that image files are web-compatible formats

### Registration buttons not working
- Verify Google Forms URLs are correct and publicly accessible
- Ensure URLs start with `https://forms.gle/` or `https://docs.google.com/forms/`
