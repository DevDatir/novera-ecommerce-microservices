import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

public class JwtTest {
    public static void main(String[] args) {
        String secret = "9aa0cc3502d271ee36315ea50254dfeb7b3e9bf36aa72cd42c661ad4d59ee530";
        byte[] key = Decoders.BASE64.decode(secret);
        SecretKey signingKey = Keys.hmacShaKeyFor(key);
        String token = Jwts.builder()
            .setSubject("test@example.com")
            .claim("userId", 2L)
            .claim("role", "USER")
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(signingKey)
            .compact();
        System.out.println("TOKEN=" + token);
        var claims = Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token).getBody();
        System.out.println("userId=" + claims.get("userId", Long.class));
        System.out.println("VALID=true");
    }
}
