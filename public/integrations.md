import { Tag } from '@/components/Tag'
import { HeroPattern } from '@/components/HeroPattern'

export const description =
  'Manage your secrets and environment variables with the Phase CLI'

<HeroPattern />

# Integrations 

You can use Phase run to inject secrets to your application process during runtime. There is no need for you to change any code or add a dependency. {{ className: 'lead' }}

Examples:

```bash
phase secrets list --show
KEY 🗝️                   | VALUE ✨
--------------------------------------------------------------------------------------
AWS_ACCESS_KEY_ID        | AKIA2OGYBAH6QLWOYDVN
AWS_SECRET_ACCESS_KEY    | 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
```

## Python

```python
import os

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
```

## JavaScript

```js
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
```

## TypeScript

```typescript
const awsAccessKey: string = process.env.AWS_ACCESS_KEY_ID || ''
const awsSecretKey: string = process.env.AWS_SECRET_ACCESS_KEY || ''
```

## Golang

```go
package main

import "os"

func main() {
    awsAccessKey := os.Getenv("AWS_ACCESS_KEY_ID")
    awsSecretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
}
```

## Rust

```rust
use std::env;

fn main() {
    let aws_access_key = env::var("AWS_ACCESS_KEY_ID").unwrap_or_default();
    let aws_secret_key = env::var("AWS_SECRET_ACCESS_KEY").unwrap_or_default();
}

```

## Julia

```julia

aws_access_key = ENV["AWS_ACCESS_KEY_ID"]
aws_secret_key = ENV["AWS_SECRET_ACCESS_KEY"]

```

## Java

```java
public class Main {
    public static void main(String[] args) {
        String awsAccessKey = System.getenv("AWS_ACCESS_KEY_ID");
        String awsSecretKey = System.getenv("AWS_SECRET_ACCESS_KEY");
    }
}

```

## Kotlin

```kotlin
fun main() {
    val awsAccessKey = System.getenv("AWS_ACCESS_KEY_ID")
    val awsSecretKey = System.getenv("AWS_SECRET_ACCESS_KEY")
}

```

## PHP

```php
$awsAccessKey = getenv('AWS_ACCESS_KEY_ID');
$awsSecretKey = getenv('AWS_SECRET_ACCESS_KEY');

```

# C

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    char *awsAccessKey;
    char *awsSecretKey;

    awsAccessKey = getenv("AWS_ACCESS_KEY_ID");
    awsSecretKey = getenv("AWS_SECRET_ACCESS_KEY");

    printf("AWS_ACCESS_KEY_ID: %s\n", awsAccessKey);
    printf("AWS_SECRET_ACCESS_KEY: %s\n", awsSecretKey);

    return 0;
}

```

C++

```cpp
#include <iostream>
#include <cstdlib>

int main() {
    const char* awsAccessKey = std::getenv("AWS_ACCESS_KEY_ID");
    const char* awsSecretKey = std::getenv("AWS_SECRET_ACCESS_KEY");

    std::cout << "AWS_ACCESS_KEY_ID: " << awsAccessKey << std::endl;
    std::cout << "AWS_SECRET_ACCESS_KEY: " << awsSecretKey << std::endl;

    return 0;
}
```

## C#

```c#
using System;

namespace EnvironmentVariablesExample {
    class Program {
        static void Main() {
            string awsAccessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID");
            string awsSecretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY");

            Console.WriteLine($"AWS_ACCESS_KEY_ID: {awsAccessKey}");
            Console.WriteLine($"AWS_SECRET_ACCESS_KEY: {awsSecretKey}");
        }
    }
}
```

## Ruby

```rb
aws_access_key = ENV['AWS_ACCESS_KEY_ID']
aws_secret_key = ENV['AWS_SECRET_ACCESS_KEY']
```

## R

```r
aws_access_key <- Sys.getenv("AWS_ACCESS_KEY_ID")
aws_secret_key <- Sys.getenv("AWS_SECRET_ACCESS_KEY")
```
