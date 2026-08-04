import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;

public class JwtTest {
    public static void main(String[] args) {
        String secret = "9aa0cc3502d271ee36315ea50254dfeb7b3e9bf36aa72cd42c661ad4d59ee530";
        byte[] key = Decoders.BASE64.decode(secret);
        SecretKey signingKey = Keys.hmacShaKeyFor(key);
        String token = Jwts.builder()
            .subject("test@example.com")
            .claim("userId", 2L)
            .claim("role", "USER")
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(signingKey)
            .compact();
        System.out.println("TOKEN=" + token);
        var claims = Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload();
        System.out.println("userId=" + claims.get("userId", Long.class));
        System.out.println("VALID=true");
    }
}
