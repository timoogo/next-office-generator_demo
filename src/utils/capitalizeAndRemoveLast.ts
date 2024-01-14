export default function capitalizeAndRemoveLast(str: string): string {
    // Check if the input string is not empty
    if (str.length > 0) {
        // Capitalize the first letter
        const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

        // Remove the last letter
        const result = capitalized.slice(0, -1);

        return result;
    } else {
        // Return an empty string if the input is empty
        return "";
    }
}