import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';

export const JAVASCRIPT_DEFAULT_CODE = `'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\\n');
    main();
});

{{CONTENT}}

function main() {
    inputString.forEach((input, index) => {
        process.stdout.write(desiredFunction(input));
        if (index !== inputString.length - 1) {
            process.stdout.write('\\n');
        }
    });
}`;

export const JAVASCRIPT_USER_CODE = `/*
* Complete the function below according to the question.
*/

function desiredFunction(input) {
   // Write your code here.
   return input;
}`

export const JAVA_DEFAULT_CODE = `import java.io.*;
import java.math.*;
import java.security.*;
import java.text.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.regex.*;
import java.util.stream.*;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

class Result {

    {{CONTENT}}

}

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(System.out));
        
        while (true) {
            String s = bufferedReader.readLine();
            if(s == null) break;

            String result = Result.desiredFunction(s);

            bufferedWriter.write(result);
            bufferedWriter.newLine();
        };

        bufferedReader.close();
        bufferedWriter.close();
    }
}
`;

export const JAVA_USER_CODE = `/*
* Complete the function below according to the question.
*/
public static String desiredFunction(String s) {
    // Write your code here
    return s;
}`;

export const languageOptions = [ 
    { value: 62, text: 'Java', extension: java, defaultCode: JAVA_USER_CODE, completeTemplate: JAVA_DEFAULT_CODE },
    { value: 63, text: 'JavaScript', extension: javascript, defaultCode: JAVASCRIPT_USER_CODE, completeTemplate: JAVASCRIPT_DEFAULT_CODE }
]